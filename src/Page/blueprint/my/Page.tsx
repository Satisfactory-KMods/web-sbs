import BlueprintFilter from "@app/Components/Blueprints/BlueprintFilter";
import BlueprintRow from "@app/Components/Blueprints/BlueprintRow";
import PageManager from "@app/Components/Main/PageManager";
import { tRPCAuth, tRPCHandleError } from "@app/Lib/tRPC";
import type { IndexLoaderData } from "@app/Page/blueprint/list/Loader";
import { useRawPageHandler } from "@app/hooks/useRawPageHandler";
import { usePageTitle } from "@kyri123/k-reactutils";
import type { BlueprintData } from "@server/MongoDB/MongoBlueprints";
import type { FilterSchema } from "@server/trpc/routings/public/blueprint";
import type { FunctionComponent } from "react";
import { useState } from "react";
import { useLoaderData } from "react-router-dom";

const Component: FunctionComponent = () => {
	usePageTitle( `SBS - My Blueprints` );
	const { blueprints, totalBlueprints } = useLoaderData() as IndexLoaderData;

	const [ TotalBlueprints, setTotalBlueprints ] = useState<number>( () => totalBlueprints );
	const [ Blueprints, setBlueprints ] = useState<BlueprintData[]>( () => blueprints );

	const [ filter, setFilter ] = useState<FilterSchema>( {} );
	const [ isFetching, setIsFetching ] = useState<boolean>( false );
	const onPageChange: Parameters<typeof useRawPageHandler>[1] = async( options ) => {
		setIsFetching( true );
		const queryFilter = { filterOptions: filter, ...options };
		const Blueprints = await tRPCAuth.blueprints.myBlueprints.query( queryFilter ).catch( tRPCHandleError );
		if( Blueprints ) {
			setBlueprints( Blueprints.blueprints );
			setTotalBlueprints( Blueprints.totalBlueprints );
		}
	    setIsFetching( false );
	};
	const { setPage, currentPage, maxPage, filterOption } = useRawPageHandler( TotalBlueprints, onPageChange, 12 );
	const doFetch = async() => onPageChange( filterOption );

	return (
		<div className="flex flex-col">
			<BlueprintFilter filterSchema={ [ filter, setFilter ] } isFetching={ isFetching } doFetch={ doFetch } >
				My Blueprints ({ TotalBlueprints })
			</BlueprintFilter>
			<PageManager MaxPage={ maxPage } Page={ currentPage } OnPageChange={ setPage } />

			<div className="flex flex-col gap-2 mt-2">
				{ Blueprints.map( BP => <BlueprintRow key={ BP._id } Data={ BP } onToggled={ doFetch } /> ) }
			</div>

			<PageManager Hide={ maxPage === currentPage } MaxPage={ maxPage } Page={ currentPage } OnPageChange={ setPage } />
		</div>
	);
};

export { Component };


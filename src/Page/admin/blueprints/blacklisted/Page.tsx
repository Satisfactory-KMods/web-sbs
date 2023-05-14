import BlueprintFilter from "@app/Components/Blueprints/BlueprintFilter";
import BlueprintRow from "@app/Components/Blueprints/BlueprintRow";
import PageManager from "@app/Components/Main/PageManager";
import { tRPC_Auth, tRPC_handleError } from "@app/Lib/tRPC";
import type { IndexLoaderData } from "@app/Page/blueprint/list/Loader";
import { useRawPageHandler } from "@app/hooks/useRawPageHandler";
import { usePageTitle } from "@kyri123/k-reactutils";
import type { BlueprintData } from "@server/MongoDB/DB_Blueprints";
import type { FilterSchema } from "@server/trpc/routings/public/blueprint";
import type { FunctionComponent } from "react";
import { useState } from "react";
import { useLoaderData } from "react-router-dom";

const Component: FunctionComponent = () => {
	const { blueprints, totalBlueprints } = useLoaderData() as IndexLoaderData;

	const [ TotalBlueprints, setTotalBlueprints ] = useState<number>( () => totalBlueprints );
	const [ Blueprints, setBlueprints ] = useState<BlueprintData[]>( () => blueprints );

	usePageTitle( `SBS - My Blueprints` );

	const [ filter, setFilter ] = useState<FilterSchema>( {} );
	const [ isFetching, setIsFetching ] = useState<boolean>( false );
	const onPageChange: Parameters<typeof useRawPageHandler>[1] = async( options ) => {
		setIsFetching( true );
		const queryFilter = { filterOptions: filter, ...options };
		const Blueprints = await tRPC_Auth.blueprints.adminBlueprints.query( queryFilter ).catch( tRPC_handleError );
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
				Blacklisted Blueprints ({ TotalBlueprints })
			</BlueprintFilter>
			<PageManager MaxPage={ maxPage } Page={ currentPage } OnPageChange={ setPage } />

			<div className="flex flex-col gap-2 mt-2">
				{ Blueprints.map( BP => <BlueprintRow key={ BP._id } Data={ BP } onToggled={ doFetch } /> ) }
			</div>

			<PageManager Hide={ maxPage === currentPage } MaxPage={ maxPage } Page={ currentPage } OnPageChange={ setPage } />
		</div>
	);
};

export {
	Component
};


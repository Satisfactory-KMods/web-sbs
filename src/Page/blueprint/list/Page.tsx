import BlueprintCard from "@app/Components/Blueprints/BlueprintCard";
import BlueprintFilter from "@app/Components/Blueprints/BlueprintFilter";
import PageManager from "@app/Components/Main/PageManager";
import {
	tRPCHandleError,
	tRPCPublic
} from "@applib/tRPC";
import { useRawPageHandler } from "@hooks/useRawPageHandler";
import { usePageTitle } from "@kyri123/k-reactutils";
import type { IndexLoaderData } from "@page/blueprint/list/Loader";
import type { BlueprintData } from "@server/MongoDB/MongoBlueprints";
import type { FilterSchema } from "@server/trpc/routings/public/blueprint";
import { Button } from "flowbite-react";
import type { FunctionComponent } from "react";
import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import { useLoaderData, useNavigate } from "react-router-dom";


const Component: FunctionComponent = () => {
	const { blueprints, totalBlueprints } = useLoaderData() as IndexLoaderData;
	const nav = useNavigate();

	const [ TotalBlueprints, setTotalBlueprints ] = useState<number>( () => totalBlueprints );
	const [ Blueprints, setBlueprints ] = useState<BlueprintData[]>( () => blueprints );

	usePageTitle( `SBS - Blueprints` );

	const [ filter, setFilter ] = useState<FilterSchema>( {} );
	const [ isFetching, setIsFetching ] = useState<boolean>( false );
	const onPageChange: Parameters<typeof useRawPageHandler>[1] = async options => {
		setIsFetching( true );
		const queryFilter = { filterOptions: filter, ...options };
		const Blueprints = await tRPCPublic.blueprint.getBlueprints.query( queryFilter ).catch( tRPCHandleError );
		if( Blueprints ) {
			setBlueprints( Blueprints.blueprints );
			setTotalBlueprints( Blueprints.totalBlueprints );
		}
	    setIsFetching( false );
	};
	const { setPage, currentPage, maxPage, filterOption } = useRawPageHandler( TotalBlueprints, onPageChange, 12 );
	const doFetch = async() => onPageChange( filterOption );


	return (
		<>
			<BlueprintFilter filterSchema={ [ filter, setFilter ] } isFetching={ isFetching } doFetch={ doFetch } >
				<span className="flex-1">
					Blueprint Filter ({ TotalBlueprints })
				</span>
				<Button size="xs" color="green" onClick={ () => nav( "/blueprint/create" ) }><FaPlus className="me-2" /> Add a new blueprint</Button>
			</BlueprintFilter>
			<PageManager MaxPage={ maxPage } Page={ currentPage } OnPageChange={ setPage } />

			<div className="mt-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-3">
				{ Blueprints.map( BP => <BlueprintCard key={ BP._id } Data={ BP } onToggled={ doFetch } /> ) }
			</div>

			<PageManager Hide={ maxPage === currentPage } MaxPage={ maxPage } Page={ currentPage } OnPageChange={ setPage } />
		</>
	);
};

export { Component };


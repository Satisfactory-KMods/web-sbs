import BlueprintFilter from "@app/Components/Blueprints/BlueprintFilter";
import PageManager from "@app/Components/Main/PageManager";
import BlueprintPackRow from "@app/Components/packs/BlueprintPackRow";
import { tRPCAuth, tRPCHandleError } from "@app/Lib/tRPC";
import type { BlueprintPackListLoaderData } from "@app/Page/blueprintpacks/list/Loader";
import { useRawPageHandler } from "@app/hooks/useRawPageHandler";
import { usePageTitle } from "@kyri123/k-reactutils";
import type { BlueprintPackExtended } from "@server/MongoDB/MongoBlueprints";
import type { FilterSchema } from "@server/trpc/routings/public/blueprint";
import { Button } from "flowbite-react";
import type { FunctionComponent } from "react";
import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import { useLoaderData, useNavigate } from "react-router-dom";


const Component: FunctionComponent = () => {
	usePageTitle( `SBS - My Blueprint Packs` );
	const nav = useNavigate();
	const { blueprintPacks, totalBlueprints } = useLoaderData() as BlueprintPackListLoaderData;

	const [ totalPacks, setTotalPacks ] = useState<number>( () => totalBlueprints );
	const [ packs, setPacks ] = useState<BlueprintPackExtended[]>( () => blueprintPacks );

	usePageTitle( `SBS - Blueprints` );

	const [ filter, setFilter ] = useState<FilterSchema>( {} );
	const [ isFetching, setIsFetching ] = useState<boolean>( false );
	const onPageChange: Parameters<typeof useRawPageHandler>[1] = async options => {
		setIsFetching( true );
		const queryFilter = { filterOptions: filter, ...options };
		const queryPacks = await tRPCAuth.blueprintPacks.my.query( queryFilter ).catch( tRPCHandleError );
		if( queryPacks ) {
			setPacks( queryPacks.blueprintPacks );
			setTotalPacks( queryPacks.totalBlueprints );
		}
	    setIsFetching( false );
	};
	const { setPage, currentPage, maxPage, filterOption } = useRawPageHandler( totalPacks, onPageChange, 20 );
	const doFetch = async() => onPageChange( filterOption );

	return (
		<div className="flex flex-col">
			<BlueprintFilter filterSchema={ [ filter, setFilter ] } isFetching={ isFetching } doFetch={ doFetch }>
				<span className="flex-1">
					Blueprint Pack Filter ({ totalPacks })
				</span>
				<Button size="xs" color="green" onClick={ () => nav( "/blueprintpacks/create" ) }><FaPlus className="me-2" /> Add a new blueprint pack</Button>
			</BlueprintFilter>
			<PageManager MaxPage={ maxPage } Page={ currentPage } OnPageChange={ setPage } />

			<div className="mt-3 grid grid-cols-1 gap-3">
				{ packs.map( pack => ( <BlueprintPackRow key={ pack._id } data={ pack } onToggled={ doFetch } /> ) ) }
			</div>

			<PageManager Hide={ maxPage === currentPage } MaxPage={ maxPage } Page={ currentPage } OnPageChange={ setPage } />
		</div>
	);
};

export { Component };


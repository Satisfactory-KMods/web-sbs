import BlueprintFilter from "@app/Components/Blueprints/BlueprintFilter";
import BlueprintRow from "@app/Components/Blueprints/BlueprintRow";
import PageManager from "@app/Components/Main/PageManager";
import type { UserBlueprintLoaderData } from "@app/Page/blueprint/user/[owner]Loader";
import { useAuth } from "@app/hooks/useAuth";
import {
	tRPCHandleError,
	tRPCPublic
} from "@applib/tRPC";
import { useRawPageHandler } from "@hooks/useRawPageHandler";
import { usePageTitle } from "@kyri123/k-reactutils";
import type { BlueprintData } from "@server/MongoDB/MongoBlueprints";
import type { FilterSchema } from "@server/trpc/routings/public/blueprint";
import { Button } from "flowbite-react";
import type { FunctionComponent } from "react";
import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import { useLoaderData, useNavigate, useParams } from "react-router-dom";


const Component: FunctionComponent = () => {
	const { owner } = useParams();
	const nav = useNavigate();
	const { loggedIn } = useAuth();
	const { blueprints, totalBlueprints, showUser } = useLoaderData() as UserBlueprintLoaderData;
	usePageTitle( `SBS - ${ showUser.username } Blueprints` );

	const [ TotalBlueprints, setTotalBlueprints ] = useState<number>( () => totalBlueprints );
	const [ Blueprints, setBlueprints ] = useState<BlueprintData[]>( () => blueprints );

	const [ filter, setFilter ] = useState<FilterSchema>( {} );
	const [ isFetching, setIsFetching ] = useState<boolean>( false );
	const onPageChange: Parameters<typeof useRawPageHandler>[1] = async options => {
		setIsFetching( true );
		const queryFilter = { filterOptions: filter, ...options, owner };
		const Blueprints = await tRPCPublic.blueprint.getBlueprints.query( queryFilter ).catch( tRPCHandleError );
		if( Blueprints ) {
			setBlueprints( Blueprints.blueprints );
			setTotalBlueprints( Blueprints.totalBlueprints );
		}
	    setIsFetching( false );
	};
	const { setPage, currentPage, maxPage, filterOption } = useRawPageHandler( TotalBlueprints, onPageChange, 20 );
	const doFetch = async() => onPageChange( filterOption );

	return ( <>
		<div className="flex flex-col">
			<BlueprintFilter filterSchema={ [ filter, setFilter ] } isFetching={ isFetching } doFetch={ doFetch } >
				<span className="flex-1">
					Blueprints from { showUser.username } ({ TotalBlueprints })
				</span>
			</BlueprintFilter>
			<PageManager MaxPage={ maxPage } Page={ currentPage } OnPageChange={ setPage } />

			<div className="flex flex-col gap-2 mt-2">
				{ Blueprints.map( BP => <BlueprintRow key={ BP._id } Data={ BP } onToggled={ doFetch } /> ) }
			</div>

			<PageManager Hide={ maxPage === currentPage } MaxPage={ maxPage } Page={ currentPage } OnPageChange={ setPage } />
		</div>
	</> );
};

export { Component };


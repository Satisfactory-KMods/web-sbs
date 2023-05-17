import PageManager from "@app/Components/Main/PageManager";
import TagRow from "@app/Components/admin/TagRow";
import { LoadingButton } from "@app/Components/elements/Buttons";
import { SBSInput } from "@app/Components/elements/Inputs";
import { successSwal, tRPCAuth, tRPCHandleError } from "@app/Lib/tRPC";
import type { TagAdminLoaderData } from "@app/Page/admin/tags/Loader";
import { useRawPageHandler } from "@app/hooks/useRawPageHandler";
import { usePageTitle } from "@kyri123/k-reactutils";
import { Table } from "flowbite-react";
import type { FunctionComponent } from "react";
import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import { useLoaderData } from "react-router-dom";


const Component: FunctionComponent = () => {
	usePageTitle( `SBS - Admin: Tags` );
	const { tags, totalTags } = useLoaderData() as TagAdminLoaderData;

	const [ total, setTotal ] = useState( () => totalTags );
	const [ data, setData ] = useState( () => tags );
	const [ DisplayName, setDisplayName ] = useState( "" );
	const [ isFetching, setIsFetching ] = useState( false );

	const onPageChange: Parameters<typeof useRawPageHandler>[1] = async options => {
		const response = await tRPCAuth.adminTags.list.query( options ).catch( tRPCHandleError );
		if( response ) {
			setData( response.data );
			setTotal( response.count );
		}
	};
	const { setPage, currentPage, maxPage, filterOption } = useRawPageHandler( total, onPageChange, 20 );
	const doFetch = async() => onPageChange( filterOption );

	const createTag = async() => {
		setIsFetching( true );
		await tRPCAuth.adminTags.create.mutate( { DisplayName } )
			.then( successSwal )
			.catch( tRPCHandleError );
		await doFetch();
		setIsFetching( false );
	};

	return (
		<div className="flex flex-col">
			<div className="w-full bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
				<div className="bg-gray-700 p-3 text-2xl font-semibold rounded-t-lg text-neutral-300 border-b border-gray-600">
					Admin: Tags
				</div>
				<div className="flex gap-2 p-3">
					<SBSInput label="Display Name" value={ DisplayName } mainClassName="flex-1"
						onChange={ ( e: any ) => setDisplayName( e.target.value ) } />
					<LoadingButton color="green" isLoading={ isFetching } onClick={ createTag } Icon={ FaPlus } disabled={ DisplayName.clearWs().length < 1 } >Add Tag</LoadingButton>
				</div>
			</div>

			<PageManager MaxPage={ maxPage } Page={ currentPage } OnPageChange={ setPage } />

			<div className="mt-2">
				<Table striped={ true }>
					<Table.Head>
						<Table.HeadCell className="w-0">
    					  	TagId
						</Table.HeadCell>
						<Table.HeadCell>
      						Tag
						</Table.HeadCell>
						<Table.HeadCell className="w-0">
      						Actions
						</Table.HeadCell>
					</Table.Head>
					<Table.Body>
						{ data.map( tag => <TagRow key={ tag._id } data={ tag } doFetch={ doFetch } /> ) }
					</Table.Body>
				</Table>
			</div>
		</div>
	);
};

export {
    Component
};


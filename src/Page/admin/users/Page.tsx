import PageManager from "@app/Components/Main/PageManager";
import UserRow from "@app/Components/admin/UserRow";
import { tRPCAuth, tRPCHandleError } from "@app/Lib/tRPC";
import type { UserAdminLoaderData } from "@app/Page/admin/users/Loader";
import { useRawPageHandler } from "@app/hooks/useRawPageHandler";
import { usePageTitle } from "@kyri123/k-reactutils";
import { Table } from "flowbite-react";
import type { FunctionComponent } from "react";
import { useState } from "react";
import { useLoaderData } from "react-router-dom";


const Component: FunctionComponent = () => {
	usePageTitle( `SBS - Admin: Users` );
	const { users, totalTags } = useLoaderData() as UserAdminLoaderData;

	const [ total, setTotal ] = useState( () => totalTags );
	const [ data, setData ] = useState( () => users );

	const onPageChange: Parameters<typeof useRawPageHandler>[1] = async options => {
		const response = await tRPCAuth.adminUsers.listUsers.query( options ).catch( tRPCHandleError );
		if( response ) {
			setData( response.data );
			setTotal( response.count );
		}
	};
	const { setPage, currentPage, maxPage, filterOption } = useRawPageHandler( total, onPageChange, 20 );
	const doFetch = async() => onPageChange( filterOption );

	return (
		<div className="flex flex-col">
			<div className="w-full bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
				<div className="bg-gray-700 p-3 text-2xl font-semibold text-neutral-300 border-b border-gray-600">
					Admin: Users
				</div>
			</div>

			<PageManager MaxPage={ maxPage } Page={ currentPage } OnPageChange={ setPage } />

			<div className="mt-2">
				<Table striped={ true }>
					<Table.Head>
						<Table.HeadCell className="w-0">
    					  	Id
						</Table.HeadCell>
						<Table.HeadCell className="w-0">
      						User Name
						</Table.HeadCell>
						<Table.HeadCell>
      						Role
						</Table.HeadCell>
						<Table.HeadCell className="w-0">
      						Actions
						</Table.HeadCell>
					</Table.Head>
					<Table.Body>
						{ data.map( tag => <UserRow key={ tag._id } data={ tag } doFetch={ doFetch } /> ) }
					</Table.Body>
				</Table>
			</div>
		</div>
	);
};

export {
	Component
};


import { LoadingButton } from "@app/Components/elements/Buttons";
import { onConfirm, successSwal, tRPCAuth, tRPCHandleError } from "@app/Lib/tRPC";
import { ERoles } from "@app/Shared/Enum/ERoles";
import { useAuth } from "@app/hooks/useAuth";
import type { ClientUserAccount } from "@server/MongoDB/MongoUserAccount";
import { Select, Table } from "flowbite-react";
import _ from "lodash";
import type { FunctionComponent } from "react";
import { useId } from "react";
import { BiTrash } from "react-icons/bi";


interface UserRowProps {
	data: ClientUserAccount,
	doFetch: () => Promise<void>
}

const UserRow: FunctionComponent<UserRowProps> = ( { data, doFetch } ) => {
	const { user } = useAuth();
	const id = useId();
	const deleteUser = async() => {
		if( await onConfirm( "User wirklich löschen?" ) ) {
			await tRPCAuth.adminUsers.delete.mutate( { id: data._id } )
				.then( successSwal )
				.catch( tRPCHandleError );
			await doFetch();
		}
	};

	const modifyRole = async( newRole: number ) => {
		await tRPCAuth.adminUsers.setRole.mutate( { id: data._id, role: newRole as ERoles } )
			.then( successSwal )
			.catch( tRPCHandleError );
	};

	return (
		<Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
			<Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
				{ data._id }
			</Table.Cell>
			<Table.Cell>
				{ data.username }
			</Table.Cell>
			<Table.Cell>
				<Select onChange={ e => modifyRole( parseInt( e.target.value ) ) } defaultValue={ data.role } disabled={ _.isEqual( user.Get._id, data._id ) }>
					{ Object.entries( ERoles ).filter( e => !isNaN( parseInt( e[ 0 ] ) ) ).map( ( [ key, value ] ) => (
						<option key={ id + key } value={ key }>
      						[{ key }] { value }
						</option>
					) ) }
				</Select>
			</Table.Cell>
			<Table.Cell className="flex gap-2">
				<LoadingButton disabled={ _.isEqual( user.Get._id, data._id ) } color="red" isLoading={ false } onClick={ deleteUser } Icon={ BiTrash } >Delete</LoadingButton>
			</Table.Cell>
		</Table.Row>
	);
};

export default UserRow;

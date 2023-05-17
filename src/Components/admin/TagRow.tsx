import { LoadingButton } from "@app/Components/elements/Buttons";
import { SBSInput } from "@app/Components/elements/Inputs";
import { onConfirm, successSwal, tRPCAuth, tRPCHandleError } from "@app/Lib/tRPC";
import type { Tag } from "@server/MongoDB/MongoTags";
import { Table } from "flowbite-react";
import _ from "lodash";
import type { FunctionComponent } from "react";
import { useState } from "react";
import { BiSave, BiTrash } from "react-icons/bi";

interface TagRowProps {
	data: Tag,
	doFetch: () => Promise<void>,
}

const TagRow: FunctionComponent<TagRowProps> = ( { data, doFetch } ) => {
	const [ DisplayName, setDisplayName ] = useState( () => data.DisplayName );

	const deleteTag = async() => {
		if( await onConfirm( "Tag wirklich löschen?" ) ) {
			await tRPCAuth.adminTags.delete.mutate( { id: data._id } )
				.then( successSwal )
				.catch( tRPCHandleError );
			await doFetch();
		}
	};

	const editTag = async() => {
		await tRPCAuth.adminTags.edit.mutate( { id: data._id, DisplayName } )
			.then( successSwal )
			.catch( tRPCHandleError );
	};

	return (
		<Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
			<Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
				{ data._id }
			</Table.Cell>
			<Table.Cell>
				<SBSInput value={ DisplayName } onChange={ e => setDisplayName( () => e.target.value ) } label="Display Name" />
			</Table.Cell>
			<Table.Cell className="flex gap-2">
				<LoadingButton color="green" isLoading={ false } onClick={ editTag } Icon={ BiSave } disabled={ _.isEqual( data.DisplayName, DisplayName ) } >Save</LoadingButton>
				<LoadingButton color="red" isLoading={ false } onClick={ deleteTag } Icon={ BiTrash } >Delete</LoadingButton>
			</Table.Cell>
		</Table.Row>
	);
};

export default TagRow;
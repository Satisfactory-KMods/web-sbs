import type { Tag }                    from "@server/MongoDB/DB_Tags";
import type { FunctionComponent } from "react";
import {
	Button,
	ButtonGroup
}                                 from "react-bootstrap";
import * as Icon                  from "react-icons/bs";

interface IAdminTagRowProps {
	Tag : Tag,
	onRemove : ( Id : string ) => void,
	onEdit : ( Tag : Tag ) => void
}

const AdminTagRow : FunctionComponent<IAdminTagRowProps> = ( { Tag, onEdit, onRemove } ) => {
	return (
		<tr>
			<td className={ "px-2 text-center" }>{ Tag._id }</td>
			<td className={ "px-3 text-center" }>{ Tag.DisplayName }</td>
			<td className={ "p-0 text-center w-0" }>
				<ButtonGroup className={ "w-100" }>
					<Button className={ "rounded-0" } variant="danger" onClick={ () => onRemove( Tag._id ) }>
						<Icon.BsTrashFill/>
					</Button>
					<Button className={ "rounded-0" } variant="success" onClick={ () => onEdit( Tag ) }>
						<Icon.BsPencilSquare/>
					</Button>
				</ButtonGroup>
			</td>
		</tr>
	);
};

export default AdminTagRow;

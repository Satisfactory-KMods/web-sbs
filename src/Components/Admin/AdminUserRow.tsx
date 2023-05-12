import { useAuth } from "@hooks/useAuth";
import type { UserAccount } from "@server/MongoDB/DB_UserAccount";
import { ERoles } from "@shared/Enum/ERoles";
import type { FunctionComponent } from "react";
import * as Icon from "react-icons/bs";

interface IAdminUserRowProps {
	User : UserAccount,
	onRemove : ( User : UserAccount ) => void,
	onEditRole : ( User : UserAccount, Tag : ERoles ) => void
}

const AdminUserRow : FunctionComponent<IAdminUserRowProps> = ( { User, onEditRole, onRemove } ) => {
	const { user } = useAuth();
	return (
		<tr>
			<td className="px-2 text-center">{ User._id }</td>
			<td className="px-3 text-center">{ User.username }</td>
			<td className="p-0 text-center">
				{ user.Get._id !== User._id &&
					<select className="form-control w-100 h-100 rounded-none"
					        value={ User.role.toString().clearWs() }
					        onChange={ ( e ) => onEditRole( User, parseInt( e.target.value ) ) }>
						{ Object.keys( ERoles ).splice( 0, 11 ).map( ( Role ) =>
							<option key={ Role } value={ Role.toString().clearWs() }>{ Role }</option>
						) }
					</select> }
			</td>
			<td className="p-0 text-center w-0">
				{ user.Get._id !== User._id && <ButtonGroup className="w-100">
					<Button className="rounded-none" variant="danger" onClick={ () => onRemove( User ) }>
						<Icon.BsTrashFill />
					</Button>
				</ButtonGroup> }
			</td>
		</tr>
	);
};

export default AdminUserRow;

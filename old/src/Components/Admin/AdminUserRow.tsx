import {
	FunctionComponent,
	useContext
}                         from "react";
import { MO_UserAccount } from "@shared/Types/MongoDB";
import {
	Button,
	ButtonGroup
}                         from "react-bootstrap";
import * as Icon          from "react-icons/bs";
import { ERoles }         from "@shared/Enum/ERoles";
import AuthContext        from "@context/AuthContext";

interface IAdminUserRowProps {
	User : MO_UserAccount,
	onRemove : ( User : MO_UserAccount ) => void,
	onEditRole : ( User : MO_UserAccount, Tag : ERoles ) => void
}

const AdminUserRow : FunctionComponent<IAdminUserRowProps> = ( { User, onEditRole, onRemove } ) => {
	const { UserData } = useContext( AuthContext );
	return (
		<tr>
			<td className={ "px-2 text-center" }>{ User._id }</td>
			<td className={ "px-3 text-center" }>{ User.username }</td>
			<td className={ "p-0 text-center" }>
				{ UserData.Get._id !== User._id &&
					<select className={ "form-control w-100 h-100 rounded-0" }
					        value={ User.role.toString().clearWs() }
					        onChange={ ( e ) => onEditRole( User, parseInt( e.target.value ) ) }>
						{ Object.keys( ERoles ).splice( 0, 11 ).map( ( Role ) =>
							<option key={ Role } value={ Role.toString().clearWs() }>{ Role }</option>
						) }
					</select> }
			</td>
			<td className={ "p-0 text-center w-0" }>
				{ UserData.Get._id !== User._id && <ButtonGroup className={ "w-100" }>
					<Button className={ "rounded-0" } variant="danger" onClick={ () => onRemove( User ) }>
						<Icon.BsTrashFill/>
					</Button>
				</ButtonGroup> }
			</td>
		</tr>
	);
};

export default AdminUserRow;

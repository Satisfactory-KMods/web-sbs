import {
	FunctionComponent,
	useContext,
	useEffect,
	useState
}                                from "react";
import { useAuthCheck }          from "@hooks/useAuthCheck";
import { ERoles }                from "@shared/Enum/ERoles";
import { useLang }               from "@hooks/useLang";
import { Table }                 from "react-bootstrap";
import AuthContext               from "@context/AuthContext";
import AdminUserRow              from "@comp/Admin/AdminUserRow";
import { API_QueryLib }          from "@applib/Api/API_Query.Lib";
import { IMO_UserAccount }       from "@shared/Types/MongoDB";
import {
	EApiAuth,
	EApiQuestionary
}                                from "@shared/Enum/EApiPath";
import { TResponse_Auth_Modify } from "@shared/Types/API_Response";
import { TRequest_Auth_Modify }  from "@shared/Types/API_Request";

const AdminUsers : FunctionComponent = () => {
	const { Lang } = useLang();
	const { AuthCheckProps, AuthCheck } = useAuthCheck( { Auth: true, Role: ERoles.admin } );
	const { UserData } = useContext( AuthContext );
	const [ Users, setUsers ] = useState<IMO_UserAccount[]>( [] );

	const QueryUsers = async() => {
		const response = await API_QueryLib.Qustionary<IMO_UserAccount>( EApiQuestionary.users, {} );
		if ( response.Data ) {
			setUsers( response.Data );
		}
	};

	useEffect( () => {
		QueryUsers();
	}, [] );

	const SendQuery = async( Id : string, Role : number, Removed = false ) => {
		const Result = await API_QueryLib.PostToAPI<TResponse_Auth_Modify, TRequest_Auth_Modify>( EApiAuth.modify, {
			UserID: Id,
			Data: {
				role: Role
			},
			Remove: Removed
		} );
		if ( Result.Success ) {
			await QueryUsers();
		}
	};

	const onRemove = async( User : IMO_UserAccount ) => {
		await SendQuery( User._id, User.role, true );
	};

	const onEditRole = async( User : IMO_UserAccount, Tag : ERoles ) => {
		await SendQuery( User._id, Tag, false );
	};

	return (
		<AuthCheck { ...AuthCheckProps }>
			<Table striped bordered hover size="sm" variant="dark">
				<thead>
				<tr>
					<th colSpan={ 4 }>
						<h3 className="p-2 flex-1">{ Lang.Navigation.Admin_Users }</h3>
					</th>
				</tr>
				<tr>
					<th className={ "px-2 text-center" }>{ Lang.AdminUsers.Id }</th>
					<th className={ "px-3 text-center" }>{ Lang.AdminUsers.Username }</th>
					<th className={ "px-3 text-center" }>{ Lang.AdminUsers.Role }</th>
					<th className={ "px-3 text-center w-0" }>{ Lang.AdminTags.Actions }</th>
				</tr>
				</thead>
				<tbody>
				{ Users.map( R => <AdminUserRow key={ R._id } User={ R } onRemove={ onRemove }
												onEditRole={ onEditRole }/> ) }
				</tbody>
			</Table>
		</AuthCheck>
	);
};

export default AdminUsers;

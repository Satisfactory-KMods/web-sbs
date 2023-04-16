import {
	FunctionComponent,
	useContext,
	useEffect,
	useState
}                             from "react";
import { useAuthCheck }       from "../../hooks/useAuthCheck";
import { ERoles }             from "../../Shared/Enum/ERoles";
import { Table }              from "react-bootstrap";
import { IMO_Blueprint }      from "../../Shared/Types/MongoDB";
import { API_QueryLib }       from "../../Lib/Api/API_Query.Lib";
import { EApiQuestionary }    from "../../Shared/Enum/EApiPath";
import AuthContext            from "../../Context/AuthContext";
import LangContext            from "../../Context/LangContext";
import BlueprintTableRowAdmin from "../../Components/Blueprints/BlueprintTableRowAdmin";

const AdminBlacklisted : FunctionComponent = () => {
	const { Lang } = useContext( LangContext );
	const { UserData } = useContext( AuthContext );
	const { AuthCheckProps, AuthCheck } = useAuthCheck( { Auth: true, RedirectTo: "/", Role: ERoles.admin } );
	const [ Blueprints, setBlueprints ] = useState<IMO_Blueprint[]>( [] );

	const DoQuery = () => {
		API_QueryLib.Qustionary<IMO_Blueprint>( EApiQuestionary.blueprints, {
			Filter: { blacklisted: true },
			Options: { sort: { createdAt: 1 } }
		} )
			.then( R => {
				if ( R && R.Success && R.Data ) {
					setBlueprints( R.Data );
				}
			} );
	};

	useEffect( () => {
		DoQuery();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [ UserData.Get._id ] );

	return (
		<AuthCheck { ...AuthCheckProps }>
			<Table striped bordered hover size="sm" variant="dark">
				<thead>
				<tr>
					<th colSpan={ 7 }>
						<h3 className="p-2">{ Lang.Navigation.Admin_BlacklistedBlueprints }</h3>
					</th>
				</tr>
				<tr>
					<th className={ "px-2 text-center" }>{ Lang.MyBlueprint.BP }</th>
					<th className={ "px-3 text-center" }>{ Lang.MyBlueprint.CreatedAt }</th>
					<th className={ "px-3 text-center" }>{ Lang.MyBlueprint.Downloads }</th>
					<th className={ "px-3 text-center" }>{ Lang.MyBlueprint.Likes }</th>
					<th className={ "px-3 text-center" }>{ Lang.MyBlueprint.Mods }</th>
					<th className={ "px-3 text-center" }>{ Lang.MyBlueprint.Tags }</th>
					<th className={ "px-2 text-center" }>{ Lang.MyBlueprint.Actions }</th>
				</tr>
				</thead>
				<tbody>
				{ Blueprints.map( R => <BlueprintTableRowAdmin Data={ R } key={ R._id } onToggled={ DoQuery }/> ) }
				</tbody>
			</Table>
		</AuthCheck>
	);
};

export default AdminBlacklisted;

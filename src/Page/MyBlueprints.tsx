import {
	FunctionComponent,
	useContext,
	useEffect,
	useState
}                          from "react";
import { useAuthCheck }    from "../hooks/useAuthCheck";
import { Table }           from "react-bootstrap";
import LangContext         from "../Context/LangContext";
import { IMO_Blueprint }   from "../Shared/Types/MongoDB";
import { API_QueryLib }    from "../Lib/Api/API_Query.Lib";
import { EApiQuestionary } from "../Shared/Enum/EApiPath";
import BlueprintTableRow   from "../Components/Blueprints/BlueprintTableRow";
import AuthContext         from "../Context/AuthContext";

const MyBlueprints : FunctionComponent = () => {
	const { Lang } = useContext( LangContext );
	const { UserData } = useContext( AuthContext );
	const { AuthCheckProps, AuthCheck } = useAuthCheck( { Auth: true, RedirectTo: "/signin" } );
	const [ MyBlueprints, setMyBlueprints ] = useState<IMO_Blueprint[]>( [] );

	useEffect( () => {
		API_QueryLib.Qustionary<IMO_Blueprint>( EApiQuestionary.blueprints, {
			Filter: { owner: UserData.Get._id },
			Options: { sort: { createdAt: 1 } }
		} )
			.then( R => {
				if ( R && R.Success && R.Data ) {
					setMyBlueprints( R.Data );
				}
			} );
	}, [] );

	return (
		<AuthCheck { ...AuthCheckProps }>
			<div>
				<Table striped bordered hover size="sm" variant="dark">
					<thead>
					<tr>
						<th colSpan={ 7 }>
							<h3 className="p-2">{ Lang.Navigation.MyBlueprints }</h3>
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
					{ MyBlueprints.map( R => <BlueprintTableRow Data={ R } key={ R._id }/> ) }
					</tbody>
				</Table>
			</div>
		</AuthCheck>
	);
};

export default MyBlueprints;

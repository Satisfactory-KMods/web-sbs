import type { FunctionComponent } from "react";
import {
	useContext,
	useEffect,
	useState
}                                 from "react";
import { Table }                  from "react-bootstrap";
import LangContext                from "@context/LangContext";
import { API_QueryLib }           from "@applib/Api/API_Query.Lib";
import { EApiQuestionary }        from "@shared/Enum/EApiPath";
import BlueprintTableRow          from "@comp/Blueprints/BlueprintTableRow";
import { useAuth }                from "@hooks/useAuth";
import type { BlueprintData }     from "@server/MongoDB/DB_Blueprints";

const Component : FunctionComponent = () => {
	const { Lang } = useContext( LangContext );
	const { user } = useAuth();
	const [ MyBlueprints, setMyBlueprints ] = useState<BlueprintData[]>( [] );

	useEffect( () => {
		API_QueryLib.Qustionary<BlueprintData>( EApiQuestionary.blueprints, {
			Filter: { owner: user.Get._id },
			Options: { sort: { createdAt: 1 } }
		} )
			.then( R => {
				if ( R && R.Success && R.Data ) {
					setMyBlueprints( R.Data );
				}
			} );
	}, [ user.Get._id ] );

	return (
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
	);
};

export { Component };

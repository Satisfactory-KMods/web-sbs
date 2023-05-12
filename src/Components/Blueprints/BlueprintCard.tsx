import { useAuth } from "@hooks/useAuth";
import { useBlueprint } from "@hooks/useBlueprint";
import type { BlueprintData } from "@server/MongoDB/DB_Blueprints";
import { useId, type FunctionComponent } from "react";
import { Link } from "react-router-dom";

interface IBlueprintCardProps {
	Data : BlueprintData;
	onToggled? : () => void;
}

const BlueprintCard : FunctionComponent<IBlueprintCardProps> = ( { Data, onToggled } ) => {
	const id = useId();
	const {
		Blueprint,
		ToggleLike,
		AllowToLike,
		AllowToEdit,
		Mods,
		Tags,
		ToggleBlacklist,
		IsOwner
	} = useBlueprint( Data );
	const { loggedIn, user } = useAuth();
	const ModList = [ ...Mods ];
	const SpliceMods = ModList.splice( 0, 3 );
	const MoreCount = ModList.length;
	const DisplayMods = SpliceMods.map( R =>
		<Link key={ id + R.id } to={ `https://ficsit.app/mod/${ R.mod_reference }` }
		      target={ "_blank" }
		      className={ " m-1 p-0" }>{ R.name }</Link> );
	
			  console.log(Data);
	return (
		<div className="w-full bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
			
		</div>
	);
};

export default BlueprintCard;

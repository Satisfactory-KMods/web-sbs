import { useBlueprint } from "@hooks/useBlueprint";
import type { BlueprintData } from "@server/MongoDB/DB_Blueprints";
import type { FunctionComponent } from "react";
import * as Icon from "react-icons/bs";
import { Link } from "react-router-dom";

interface IBlueprintTableRowProps {
	Data : BlueprintData;
	onToggled? : () => void;
}

const BlueprintTableRowAdmin : FunctionComponent<IBlueprintTableRowProps> = ( { Data, onToggled } ) => {
	const {
		BlueprintValid,
		Blueprint,
		ToggleBlacklist,
		Remove
	} = useBlueprint( Data, { IgnoreBlacklisted: true } );

	if ( !BlueprintValid ) {
		return null;
	}

	return (
		<tr>
			<td className="p-2 text-center">{ Data.name }</td>
			<td className="p-2 text-center">{ new Date( Data.createdAt! ).toLocaleString() }</td>
			<td className="p-2 text-center">{ Data.downloads }</td>
			<td className="p-2 text-center">{ Data.likes.length }</td>
			<td className="p-2 text-center">{ Data.mods.length }</td>
			<td className="p-2 text-center">{ Data.tags.length }</td>
			<td className="p-0 w-0 text-center">
				<ButtonGroup className="h-100 w-100">
					<Link to={ `/api/v1/download/${ Blueprint._id }` } target="_blank"
					      className="btn btn-dark rounded-none">
						<Icon.BsDownload />
					</Link>
					<Link to={ `/blueprint/edit/${ Blueprint._id }` }
					      className="btn btn-dark rounded-none">
						<Icon.BsGearFill />
					</Link>
					<Button variant="success" className="rounded-none" onClick={ async() => {
						if ( await ToggleBlacklist() && onToggled !== undefined ) {
							onToggled();
						}
					} }>
						<Icon.BsCheck2 />
					</Button>
					<Button className="rounded-none"
					        variant="danger"
					        onClick={ async() => {
						        if ( await Remove() && onToggled !== undefined ) {
							        onToggled();
						        }
					        } } type="button">
						<Icon.BsTrashFill />
					</Button>
				</ButtonGroup>
			</td>
		</tr>
	);
};

export default BlueprintTableRowAdmin;

import { IMO_Blueprint }     from "@shared/Types/MongoDB";
import { FunctionComponent } from "react";
import { useBlueprint }      from "@hooks/useBlueprint";
import { Link }              from "react-router-dom";
import * as Icon             from "react-icons/bs";
import {
	Button,
	ButtonGroup
}                            from "react-bootstrap";

interface IBlueprintTableRowProps {
	Data : IMO_Blueprint;
	onToggled? : () => void;
}

const BlueprintTableRow : FunctionComponent<IBlueprintTableRowProps> = ( { Data, onToggled } ) => {
	const { BlueprintValid, Blueprint, ToggleBlacklist } = useBlueprint( Data );

	if ( !BlueprintValid ) {
		return null;
	}

	return (
		<tr>
			<td className={ "p-2 text-center" }>{ Data.name }</td>
			<td className={ "p-2 text-center" }>{ new Date( Data.createdAt! ).toLocaleString() }</td>
			<td className={ "p-2 text-center" }>{ Data.downloads }</td>
			<td className={ "p-2 text-center" }>{ Data.likes.length }</td>
			<td className={ "p-2 text-center" }>{ Data.mods.length }</td>
			<td className={ "p-2 text-center" }>{ Data.tags.length }</td>
			<td className={ "p-0 w-0 text-center" }>
				<ButtonGroup className={ "h-100 w-100" }>
					<Link to={ `/blueprint/${ Blueprint._id }` } className={ "btn btn-dark rounded-0" }>
						<Icon.BsEyeFill/>
					</Link>
					<Link to={ `/api/v1/download/${ Blueprint._id }` } target={ "_blank" }
						  className={ "btn btn-dark rounded-0" }>
						<Icon.BsDownload/>
					</Link>
					<Link to={ `/blueprint/edit/${ Blueprint._id }` }
						  className={ "btn btn-dark rounded-0" }>
						<Icon.BsGearFill/>
					</Link>
					<Button className={ "rounded-0" }
							variant={ "danger" }
							onClick={ async() => {
								if ( await ToggleBlacklist() && onToggled !== undefined ) {
									onToggled();
								}
							} } type={ "button" }>
						<Icon.BsTrashFill/>
					</Button>
				</ButtonGroup>
			</td>
		</tr>
	);
};

export default BlueprintTableRow;

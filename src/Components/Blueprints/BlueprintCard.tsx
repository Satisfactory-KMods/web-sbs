import type { FunctionComponent } from "react";
import {
	Badge,
	Button,
	ButtonGroup,
	Card,
	Col
}                                 from "react-bootstrap";
import { useLang }                from "@hooks/useLang";
import { Link }                   from "react-router-dom";
import * as Icon                  from "react-icons/bs";
import { useBlueprint }           from "@hooks/useBlueprint";
import Ribbon                     from "@comp/General/Ribbon";
import ReactMarkdown              from "react-markdown";
import { ERoles }                 from "@shared/Enum/ERoles";
import { useAuth }                from "@hooks/useAuth";
import type { BlueprintData }          from "@server/MongoDB/DB_Blueprints";

interface IBlueprintCardProps {
	Data : BlueprintData;
	onToggled? : () => void;
}

const BlueprintCard : FunctionComponent<IBlueprintCardProps> = ( { Data, onToggled } ) => {
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
	const { Lang } = useLang();
	const ModList = [ ...Mods ];
	const SpliceMods = ModList.splice( 0, 3 );
	const MoreCount = ModList.length;
	const DisplayMods = SpliceMods.map( R =>
		<Link key={ R._id } to={ `https://ficsit.app/mod/${ R.mod_reference }` }
		      target={ "_blank" }
		      className={ " m-1 p-0" }>{ R.name }</Link> );

	return (
		<Col sm={ 12 } md={ 6 } className={ "mb-3 ps-0" }>
			<Card className={ "h-100" }>
				<Card.Header className={ "d-flex p-0" }>
					<h4 className={ "py-1 pt-2 px-3 flex-1" }>{ Blueprint.name }</h4>
					<Ribbon
						innerClassName={ Blueprint.mods.length >= 1 ? "text-bg-danger" : "text-bg-success" }>{ Blueprint.mods.length >= 1 ? Lang.General.IsModded : Lang.General.IsVanilla }</Ribbon>
				</Card.Header>

				<Card.Header style={ {
					backgroundImage: `url('/api/v1/image/${ Blueprint._id }')`,
					backgroundRepeat: "no-repeat",
					backgroundSize: "cover",
					height: 200,
					backgroundPosition: "center"
				} }></Card.Header>

				<Card.Body className={ "pb-0" }>
					<ReactMarkdown>{ Blueprint.description.length > 200 ? Blueprint.description.slice( 0, 200 ) + "..." : Blueprint.description }</ReactMarkdown>
				</Card.Body>

				{ Mods.length >= 1 && <Card.Footer>
					<b>{ Lang.CreateBlueprint.Mods }:</b> { Mods.length >= 4 ? <>{ DisplayMods.map( R => R ) } [...{ MoreCount }]</> : DisplayMods }
				</Card.Footer> }

				{ Tags.length >= 1 && <Card.Footer>
					{ Tags.map( R => <Badge key={ R._id } bg="secondary" className="me-2">{ R.DisplayName }</Badge> ) }
				</Card.Footer> }

				<Card.Footer className={ "p-0" }>
					<ButtonGroup className={ "h-100 w-100" }>
						<Link to={ `/blueprint/${ Blueprint._id }` } className={ "btn rounded-top-0 btn-dark" }>
							<Icon.BsEyeFill/>
						</Link>
						{ AllowToEdit &&
							<Link to={ `/blueprint/edit/${ Blueprint._id }` }
							      className={ "btn rounded-top-0 btn-dark" }>
								<Icon.BsGearFill/>
							</Link>
						}
						<Link to={ `/api/v1/download/${ Blueprint._id }` } target={ "_blank" }
						      className={ "btn rounded-top-0 btn-dark" }>
							<Icon.BsDownload/> { Blueprint.downloads }
						</Link>
						{ ( user.HasPermssion( ERoles.moderator ) || IsOwner ) &&
							<Button variant="danger" onClick={ async() => {
								if ( await ToggleBlacklist() && onToggled !== undefined ) {
									onToggled();
								}
							} }
							        className={ "rounded-top-0" }>
								<Icon.BsTrashFill/>
							</Button>
						}
						<Button disabled={ !AllowToLike }
						        variant={ loggedIn ? ( !Blueprint.likes.includes( user.Get._id ) ? "danger" : "success" ) : "dark" }
						        onClick={ ToggleLike } type={ "button" }
						        className={ "rounded-top-0" }>
							{ !Blueprint.likes.includes( user.Get._id ) ?
								<Icon.BsFillHeartbreakFill className={ "me-2" }/> :
								<Icon.BsFillHeartFill className={ "me-2" }/> } { Blueprint.likes.length }
						</Button>
					</ButtonGroup>
				</Card.Footer>
			</Card>
		</Col>
	);
};

export default BlueprintCard;

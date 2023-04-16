import { IMO_Blueprint } from "../../Shared/Types/MongoDB";
import {
	FunctionComponent,
	useContext
}                        from "react";
import {
	Button,
	ButtonGroup,
	Card,
	Col
}                        from "react-bootstrap";
import { useLang }       from "../../hooks/useLang";
import { Link }          from "react-router-dom";
import * as Icon         from "react-icons/bs";
import AuthContext       from "../../Context/AuthContext";
import { useBlueprint }  from "../../hooks/useBlueprint";

interface IBlueprintCardProps {
	Data : IMO_Blueprint;
}

const BlueprintCard : FunctionComponent<IBlueprintCardProps> = ( { Data } ) => {
	const { Blueprint, ToggleLike, AllowToLike, AllowToEdit, Mods } = useBlueprint( Data );
	const { IsLoggedIn, UserData } = useContext( AuthContext );
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
				</Card.Header>

				<Card.Header style={ {
					backgroundImage: `url('/api/v1/image/${ Blueprint._id }')`,
					backgroundRepeat: "no-repeat",
					backgroundSize: "cover",
					height: 200
				} }></Card.Header>

				<Card.Body>
					<Card.Text>
						{ Blueprint.description.length > 200 ? Blueprint.description.slice( 0, 200 ) + "..." : Blueprint.description }
					</Card.Text>
				</Card.Body>
				<Card.Footer>
					<b>{ Lang.CreateBlueprint.Mods }:</b> { Blueprint.mods.length >= 4 ? <>{ DisplayMods.map( R => R ) } [...{ MoreCount }]</> : DisplayMods }
				</Card.Footer>
				<Card.Footer className={ "p-0" }>
					<ButtonGroup className={ "h-100 w-100" }>
						<Link to={ `/blueprint/${ Blueprint._id }` } className={ "btn rounded-top-0 btn-dark" }>
							<Icon.BsEyeFill/>
						</Link>
						<Link to={ `/api/v1/download/${ Blueprint._id }` } target={ "_blank" }
						      className={ "btn rounded-top-0 btn-dark" }>
							<Icon.BsDownload/>
						</Link>
						{ AllowToEdit &&
							<Link to={ `/blueprint/edit/${ Blueprint._id }` }
							      className={ "btn rounded-top-0 btn-dark" }>
								<Icon.BsGearFill/>
							</Link>
						}
						<Button disabled={ !AllowToLike }
						        variant={ IsLoggedIn ? ( !Blueprint.likes.includes( UserData.Get._id ) ? "danger" : "success" ) : "dark" }
						        onClick={ ToggleLike } type={ "button" }
						        className={ "rounded-top-0" }>
							{ !Blueprint.likes.includes( UserData.Get._id ) ?
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

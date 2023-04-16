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
	const { Blueprint, ToggleLike, AllowToLike } = useBlueprint( Data );
	const { IsLoggedIn, UserData } = useContext( AuthContext );
	const { Lang } = useLang();
	const DisplayMods = [ ...Blueprint.mods ].splice( 0, 3 );

	return (
		<Col sm={ 12 } md={ 6 } xl={ 4 } className={ "mb-3 ps-0" }>
			<Card className={ "h-100" }>
				<Card.Header style={ { /*backgroundImage: `url('/api/v1/image/${ Blueprint._id }/img')`*/ } }
				             className={ "p-0 d-flex" }>
					<img className={ "me-3 rounded-tl-lg" } src={ `/api/v1/image/${ Blueprint._id }/logo` }
					     alt={ "logo" }
					     style={ { height: 70, width: 70 } }/>
					<div className={ "flex-1 align-middle pt-2" }>
						<Card.Title>{ Blueprint.name }</Card.Title>
						<Card.Subtitle
							className="mb-2 text-muted">{ new Date( Blueprint.createdAt || 0 ).toLocaleString() }</Card.Subtitle>
					</div>
				</Card.Header>
				<Card.Body>
					<Card.Text>
						{ Blueprint.description.length > 200 ? Blueprint.description.slice( 0, 200 ) + "..." : Blueprint.description }
					</Card.Text>
				</Card.Body>
				<Card.Footer>
					<b>{ Lang.CreateBlueprint.Mods }:</b> { Blueprint.mods.length >= 4 ? `${ DisplayMods.join( ", " ) }, [...]` : DisplayMods.join( ", " ) }
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

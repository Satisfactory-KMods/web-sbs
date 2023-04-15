import { IMO_Blueprint }      from "../../Shared/Types/MongoDB";
import {
	FunctionComponent,
	useContext,
	useState
}                             from "react";
import {
	Button,
	ButtonGroup,
	Card,
	Col
}                             from "react-bootstrap";
import { useLang }            from "../../hooks/useLang";
import { Link }               from "react-router-dom";
import * as Icon              from "react-icons/bs";
import AuthContext            from "../../Context/AuthContext";
import { API_QueryLib }       from "../../Lib/Api/API_Query.Lib";
import { EApiUserBlueprints } from "../../Shared/Enum/EApiPath";

interface IBlueprintCardProps {
	Data : IMO_Blueprint;
}

const BlueprintCard : FunctionComponent<IBlueprintCardProps> = ( { Data } ) => {
	const { IsLoggedIn, UserData } = useContext( AuthContext );
	const { Lang } = useLang();
	const DisplayMods = [ ...Data.mods ].splice( 0, 3 );
	const [ IsSending, setIsSending ] = useState( false );
	const [ Likes, setLikes ] = useState( Data.likes );

	const HandleLike = async() => {
		if ( !IsLoggedIn ) {
			API_QueryLib.FireSwal( "NotLoggedIn" );
			return;
		}

		setIsSending( true );
		const Form = new FormData();
		Form.append( "Id", Data._id );
		const Result = await API_QueryLib.PostToAPI( EApiUserBlueprints.like, Form );

		if ( Result.Success && Result.Data ) {
			setLikes( Result.Data );
		}
		setIsSending( false );
	};

	return (
		<Col sm={ 12 } md={ 6 } xl={ 4 } className={ "mb-3 ps-0" }>
			<Card className={ "h-100" }>
				<Card.Header style={ { /*backgroundImage: `url('/api/v1/image/${ Data._id }/img')`*/ } }
				             className={ "p-0 d-flex" }>
					<img className={ "me-3 rounded-tl-lg" } src={ `/api/v1/image/${ Data._id }/logo` } alt={ "logo" }
					     style={ { height: 70, width: 70 } }/>
					<div className={ "flex-1 align-middle pt-2" }>
						<Card.Title>{ Data.name }</Card.Title>
						<Card.Subtitle
							className="mb-2 text-muted">{ new Date( Data.createdAt || 0 ).toLocaleString() }</Card.Subtitle>
					</div>
				</Card.Header>
				<Card.Body>
					<Card.Text>
						{ Data.description.length > 200 ? Data.description.slice( 0, 200 ) + "..." : Data.description }
					</Card.Text>
				</Card.Body>
				<Card.Footer>
					<b>{ Lang.CreateBlueprint.Mods }:</b> { Data.mods.length >= 4 ? `${ DisplayMods.join( ", " ) }, [...]` : DisplayMods.join( ", " ) }
				</Card.Footer>
				<Card.Footer className={ "p-0" }>
					<ButtonGroup className={ "h-100 w-100" }>
						<Link to={ `/blueprint/${ Data._id }` } className={ "btn rounded-top-0 btn-dark" }>
							<Icon.BsEyeFill/>
						</Link>
						<Link to={ `/api/v1/download/${ Data._id }` } target={ "_blank" }
						      className={ "btn rounded-top-0 btn-dark" }>
							<Icon.BsDownload/>
						</Link>
						<Button
							variant={ IsLoggedIn ? ( !Likes.includes( UserData.Get._id ) ? "danger" : "success" ) : "dark" }
							onClick={ HandleLike } type={ "button" }
							className={ "rounded-top-0" }>
							{ !Likes.includes( UserData.Get._id ) ?
								<Icon.BsFillHeartbreakFill className={ "me-2" }/> :
								<Icon.BsFillHeartFill className={ "me-2" }/> } { Likes.length }
						</Button>
					</ButtonGroup>
				</Card.Footer>
			</Card>
		</Col>
	);
};

export default BlueprintCard;

import {
	FunctionComponent,
	useContext
}                       from "react";
import {
	Link,
	useParams
}                       from "react-router-dom";
import { useBlueprint } from "../hooks/useBlueprint";
import {
	Button,
	ButtonGroup,
	Card,
	Table
}                       from "react-bootstrap";
import { usePageTitle } from "@kyri123/k-reactutils";
import ReactMarkdown    from "react-markdown";
import * as Icon        from "react-icons/bs";
import AuthContext      from "../Context/AuthContext";
import { useLang }      from "../hooks/useLang";

const ShowBlueprint : FunctionComponent = () => {
	const { Lang } = useLang();
	const { id } = useParams();
	const { IsLoggedIn, UserData } = useContext( AuthContext );
	const {
		Blueprint,
		BlueprintValid,
		AllowToLike,
		ToggleLike,
		AllowToEdit,
		Mods,
		Tags,
		BlueprintData
	} = useBlueprint( id! );
	usePageTitle( `SBS - Blueprint` );

	if ( !BlueprintValid ) {
		return (
			<></>
		);
	}

	return (
		<div className={ "d-flex h-100 justify-content-center" }>
			<div className={ "align-self-center p-0 w-100" }>
				<Card className={ "mb-3" }>
					<Card.Header className={ "d-flex p-0" }>
						<h3 className={ "py-1 pt-2 px-3 flex-1" }>{ Blueprint.name }</h3>
						<Button disabled={ !AllowToLike }
						        variant={ IsLoggedIn ? ( !Blueprint.likes.includes( UserData.Get._id ) ? "danger" : "success" ) : "dark" }
						        onClick={ ToggleLike } type={ "button" } className={ "rounded-0 rounded-tr-2xl px-4" }>
							{ !Blueprint.likes.includes( UserData.Get._id ) ?
								<Icon.BsFillHeartbreakFill className={ "me-2" }/> :
								<Icon.BsFillHeartFill className={ "me-2" }/> } { Blueprint.likes.length }
						</Button>
					</Card.Header>

					<Card.Header style={ {
						backgroundImage: `url('/api/v1/image/${ Blueprint._id }')`,
						backgroundRepeat: "no-repeat",
						backgroundSize: "cover",
						height: 350
					} }></Card.Header>

					<Card.Body>
						<Card.Text>
							<ReactMarkdown>{ Blueprint.description }</ReactMarkdown>
						</Card.Text>
					</Card.Body>

					<Card.Body className={ "p-0 border-t" }>
						<Table striped border={ 1 }
						       className={ "my-0 table-bordered border-b-0 border-l-0 border-r-0" }>
							<tbody>
							<tr>
								<td>{ Lang.ShowBlueprint.ObjectCount }</td>
								<td>{ BlueprintData?.objects.length }</td>
							</tr>
							<tr>
								<td className="w-25">{ Lang.CreateBlueprint.BlueprintSize }</td>
								<td className="w-75">{ Blueprint.DesignerSize }</td>
							</tr>
							<tr>
								<td>{ Lang.CreateBlueprint.Mods }</td>
								<td>{ Mods.map( R => (
									<Link key={ R._id } to={ `https://ficsit.app/mod/${ R.mod_reference }` }
									      target={ "_blank" }
									      className={ "btn btn-secondary m-1 p-0" }>
										<img onError={ E => E.currentTarget.src = "/images/default/unknown.png" }
										     alt={ R.mod_reference } src={ R.logo }
										     className={ "w-10 rounded-l-md" }/><span
										className={ "px-2 pe-3" }>{ R.name }</span>
									</Link>
								) ) }</td>
							</tr>
							<tr>
								<td>{ Lang.CreateBlueprint.Tags }</td>
								<td>{ Tags.map( R => R.DisplayName ).join( ", " ) }</td>
							</tr>
							</tbody>
						</Table>
					</Card.Body>

					<Card.Footer className={ "p-0" }>
						<ButtonGroup className={ "h-100 w-100" }>
							{ AllowToEdit &&
								<Link to={ `/blueprint/edit/${ Blueprint._id }` }
								      className={ "btn rounded-top-0 btn-secondary" }>
									<Icon.BsGearFill/>
								</Link>
							}
							<Link to={ `/api/v1/download/${ Blueprint._id }` } target={ "_blank" }
							      className={ "btn rounded-top-0 btn-success" }>
								<Icon.BsDownload/>
							</Link>
						</ButtonGroup>
					</Card.Footer>
				</Card>
			</div>
		</div>
	);
};

export default ShowBlueprint;
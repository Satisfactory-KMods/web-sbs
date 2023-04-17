import {
	FunctionComponent,
	useContext,
	useEffect,
	useState
}                             from "react";
import { usePageTitle }       from "@kyri123/k-reactutils";
import LangContext            from "../Context/LangContext";
import { API_QueryLib }       from "../Lib/Api/API_Query.Lib";
import { EApiQuestionary }    from "../Shared/Enum/EApiPath";
import { IMO_Blueprint }      from "../Shared/Types/MongoDB";
import BlueprintCard          from "../Components/Blueprints/BlueprintCard";
import {
	Button,
	Card,
	Col,
	Form,
	Row
}                             from "react-bootstrap";
import Ribbon                 from "../Components/General/Ribbon";
import Select, { MultiValue } from "react-select";
import { IModTagOptions }     from "../Shared/Types/SelectOptions";

const Home : FunctionComponent = () => {
	const { Lang } = useContext( LangContext );

	const SelectVanilla : MultiValue<IModTagOptions<boolean | undefined>> = [
		{ value: undefined, label: Lang.General.IsModded },
		{ value: true, label: Lang.General.IsVanilla },
		{ value: false, label: Lang.General.IsModded }
	];


	usePageTitle( `SBS - ${ Lang.Navigation.Home }` );

	const [ TotalPages, setTotalPages ] = useState( 0 );
	const [ CurrentPage, setCurrentPage ] = useState( 0 );
	const [ Total, setTotal ] = useState( 0 );
	const [ Blueprints, setBlueprints ] = useState<IMO_Blueprint[]>( [] );

	const DoFetch = async() => {
		const [ CountQuery, Blueprints ] = await Promise.all( [
			API_QueryLib.PostToAPI( EApiQuestionary.num, {} ),
			API_QueryLib.Qustionary<IMO_Blueprint>( EApiQuestionary.blueprints, {
				Options: {
					limit: 15,
					skip: CurrentPage * 15,
					sort: { likes: -1 }
				}
			} )
		] );

		const Count = CountQuery.Data || 0;
		const TotalPages = Math.ceil( Count / 15 );

		setTotal( () => Count );
		setTotalPages( TotalPages );
		if ( CurrentPage > TotalPages ) {
			setCurrentPage( Math.clamp( 0, CurrentPage, TotalPages ) );
		}
		setBlueprints( () => Blueprints.Data || [] );
	};

	useEffect( () => {
		DoFetch().then( () => {
		} );
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [ CurrentPage ] );

	return (
		<>
			<Card>
				<Card.Header className={ "d-flex p-0" }>
					<h4 className={ "py-1 pt-2 px-3 flex-1" }>{ Lang.General.SearchFilter }</h4>
					<Ribbon innerClassName={ "text-bg-danger" }>ALPHA</Ribbon>
				</Card.Header>
				<Card.Body>
					<Row>
						<Col sm={ 12 } md={ 6 }>
							<div className={ "bg-dark rounded-2 border mt-2 pt-2" }>
								<span className={ "px-2" }>{ Lang.CreateBlueprint.BlueprintName }</span>
								<Form.Control className={ "bg-neutral-700 mt-2" }/>
							</div>
						</Col>
						<Col sm={ 12 } md={ 6 }>
							<div className={ "bg-dark rounded-2 border mt-2 pt-2" }>
								<span className={ "px-2" }>{ Lang.General.SortingBy }</span>
								<Select options={ SelectVanilla } className="mt-2 my-react-select-container flex-1"
								        classNamePrefix="my-react-select"/>
							</div>
						</Col>
					</Row>
					<Row>
						<Col sm={ 12 } md={ 4 }>
							<div className={ "bg-dark rounded-2 border mt-2 pt-2" }>
								<span className={ "px-2" }>{ Lang.General.FilterMods }</span>
								<Select options={ SelectVanilla } className="mt-2 my-react-select-container flex-1"
								        classNamePrefix="my-react-select"/>
							</div>
						</Col>
						<Col sm={ 12 } md={ 4 }>
							<div className={ "bg-dark rounded-2 border mt-2 pt-2" }>
								<span className={ "px-2" }>{ Lang.CreateBlueprint.Mods }</span>
								<Select options={ SelectVanilla } className="mt-2 my-react-select-container flex-1"
								        classNamePrefix="my-react-select"/>
							</div>
						</Col>
						<Col sm={ 12 } md={ 4 }>
							<div className={ "bg-dark rounded-2 border mt-2 pt-2" }>
								<span className={ "px-2" }>{ Lang.CreateBlueprint.Tags }</span>
								<Select options={ SelectVanilla } className="mt-2 my-react-select-container flex-1"
								        classNamePrefix="my-react-select"/>
							</div>
						</Col>
					</Row>
					<div className={ "mt-3" }>
						<Button className={ "me-2" }>{ Lang.General.Search }</Button>
						<Button variant={ "danger" }>{ Lang.General.ClearSearch }</Button>
					</div>
				</Card.Body>
			</Card>
			<Row className={ "px-3 mt-3" }>
				{ Blueprints.map( BP => <BlueprintCard key={ BP._id } Data={ BP } onToggled={ DoFetch }/> ) }
			</Row>
		</>
	);
};

export default Home;

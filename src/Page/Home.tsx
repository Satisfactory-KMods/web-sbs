import {
	FunctionComponent,
	useContext,
	useEffect,
	useState
}                          from "react";
import {
	usePageTitle,
	useToggle
}                          from "@kyri123/k-reactutils";
import LangContext         from "../Context/LangContext";
import { API_QueryLib }    from "../Lib/Api/API_Query.Lib";
import { EApiQuestionary } from "../Shared/Enum/EApiPath";
import {
	IMO_Blueprint,
	IMO_Mod,
	IMO_Tag
}                          from "../Shared/Types/MongoDB";
import BlueprintCard       from "../Components/Blueprints/BlueprintCard";
import {
	Button,
	Card,
	Col,
	Form,
	Row
}                          from "react-bootstrap";
import Ribbon              from "../Components/General/Ribbon";
import Select, {
	MultiValue,
	SingleValue
}                          from "react-select";
import {
	IModTagOptions,
	ISortingOptions
}                          from "../Shared/Types/SelectOptions";
import { FilterQuery }     from "mongoose";
import PageManager         from "../Components/Main/PageManager";

const Home : FunctionComponent = () => {
	const { Lang } = useContext( LangContext );

	const [ SelectTags, setSelectTags ] = useState<IModTagOptions[]>( [] );
	const [ SelectMods, setSelectMods ] = useState<IModTagOptions[]>( [] );

	useEffect( () => {
		Promise.all( [
			API_QueryLib.Qustionary<IMO_Tag>( EApiQuestionary.tags, {} ).then( R => setSelectTags( R.Data?.map( R => ( {
				label: R.DisplayName,
				value: R._id
			} ) ) || [] ) ),
			API_QueryLib.Qustionary<IMO_Mod>( EApiQuestionary.mods, {} ).then( R => setSelectMods( R.Data?.map( R => ( {
				label: R.name,
				value: R.mod_reference
			} ) ) || [] ) )
		] );
	}, [] );

	const SelectVanilla : MultiValue<IModTagOptions<boolean>> = [
		{ value: true, label: Lang.General.IsVanilla },
		{ value: false, label: Lang.General.IsModded }
	];

	const SortOptions : MultiValue<ISortingOptions<IMO_Blueprint>> = [
		{ value: 1, label: Lang.Sorting.CreatedAt, Sort: { sort: { createdAt: 1 } } },
		{ value: 1, label: Lang.Sorting.CreatedAtRev, Sort: { sort: { createdAt: -1 } } },
		{ value: 2, label: Lang.Sorting.Downloads, Sort: { sort: { downloads: 1 } } },
		{ value: 2, label: Lang.Sorting.DownloadsRev, Sort: { sort: { downloads: -1 } } },
		{ value: 3, label: Lang.Sorting.Likes, Sort: { sort: { likes: 1 } } },
		{ value: 3, label: Lang.Sorting.LikesRev, Sort: { sort: { likes: -1 } } },
		{ value: 4, label: Lang.Sorting.Mods, Sort: { sort: { mods: 1 } } },
		{ value: 4, label: Lang.Sorting.ModsRev, Sort: { sort: { mods: -1 } } },
		{ value: 5, label: Lang.Sorting.Tags, Sort: { sort: { tags: 1 } } },
		{ value: 5, label: Lang.Sorting.TagsRev, Sort: { sort: { tags: -1 } } }
	];

	const [ BlueprintName, setBlueprintName ] = useState<string>( "" );
	const [ Select_Sorting, setSelect_Sorting ] = useState<MultiValue<ISortingOptions<IMO_Blueprint>>>( [] );
	const [ Select_Vanilla, setSelect_Vanilla ] = useState<SingleValue<IModTagOptions<boolean>>>( null );
	const [ Select_Mods, setSelect_Mods ] = useState<MultiValue<IModTagOptions<string>>>( [] );
	const [ Select_Tags, setSelect_Tags ] = useState<MultiValue<IModTagOptions<string>>>( [] );


	usePageTitle( `SBS - ${ Lang.Navigation.Home }` );

	const [ TotalPages, setTotalPages ] = useState( 0 );
	const [ CurrentPage, setCurrentPage ] = useState( 0 );
	//const [ Total, setTotal ] = useState( 0 );
	const [ Blueprints, setBlueprints ] = useState<IMO_Blueprint[]>( [] );
	const [ Cleared, setCleared ] = useToggle( false );

	const DoFetch = async() => {
		let Sorting : any = {};

		for ( const S of Select_Sorting ) {
			Sorting = {
				...Sorting,
				...S.Sort.sort
			};
		}

		if ( Select_Sorting.length === 0 ) {
			Sorting = {
				createdAt: -1
			};
		}

		const Filter : FilterQuery<IMO_Blueprint> = {};

		Select_Vanilla !== null && ( Filter[ "mods.1" ] = { $exists: !Select_Vanilla.value } );
		( !Select_Vanilla?.value && Select_Mods.length > 0 ) && ( Filter.mods = { $all: Select_Mods.map( R => R.value ) } );
		( Select_Tags.length > 0 ) && ( Filter.tags = { $all: Select_Tags.map( R => R.value ) } );
		( BlueprintName.clearWs() !== "" ) && ( Filter.name = { "$regex": BlueprintName, "$options": "i" } );

		const Data = {
			Filter: Filter,
			Options: {
				limit: 15,
				skip: CurrentPage * 15,
				sort: Sorting
			}
		};
		const [ CountQuery, Blueprints ] = await Promise.all( [
			API_QueryLib.PostToAPI( EApiQuestionary.num, Data ),
			API_QueryLib.Qustionary<IMO_Blueprint>( EApiQuestionary.blueprints, Data )
		] );

		const Count = CountQuery.Data || 0;
		const TotalPages = Math.ceil( Count / 15 );

		//setTotal( () => Count );
		setTotalPages( TotalPages );
		if ( CurrentPage > TotalPages ) {
			setCurrentPage( Math.clamp( 0, CurrentPage, TotalPages ) );
		}
		setBlueprints( () => Blueprints.Data || [] );
	};

	const ResetSearch = async() => {
		setBlueprintName( "" );
		setSelect_Tags( [] );
		setSelect_Mods( [] );
		setSelect_Vanilla( null );
		setSelect_Sorting( [] );
		setCleared();
	};

	useEffect( () => {
		DoFetch().then( () => {
		} );
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [ CurrentPage, Cleared ] );

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
								<Form.Control className={ "bg-neutral-700 mt-2" } value={ BlueprintName }
								              onChange={ V => setBlueprintName( V.target.value ) }/>
							</div>
						</Col>
						<Col sm={ 12 } md={ 6 }>
							<div className={ "bg-dark rounded-2 border mt-2 pt-2" }>
								<span className={ "px-2" }>{ Lang.General.SortingBy }</span>
								<Select options={ SortOptions } className="mt-2 my-react-select-container flex-1"
								        classNamePrefix="my-react-select" isMulti={ true } value={ Select_Sorting }
								        onChange={ setSelect_Sorting }/>
							</div>
						</Col>
					</Row>
					<Row>
						<Col sm={ 12 } md={ 4 }>
							<div className={ "bg-dark rounded-2 border mt-2 pt-2" }>
								<span className={ "px-2" }>{ Lang.General.FilterMods }</span>
								<Select options={ SelectVanilla } className="mt-2 my-react-select-container flex-1"
								        value={ Select_Vanilla } isClearable={ true }
								        classNamePrefix="my-react-select" onChange={ setSelect_Vanilla }/>
							</div>
						</Col>
						<Col sm={ 12 } md={ 4 }>
							<div className={ "bg-dark rounded-2 border mt-2 pt-2" }>
								<span className={ "px-2" }>{ Lang.CreateBlueprint.Mods }</span>
								<Select options={ SelectMods } className="mt-2 my-react-select-container flex-1"
								        value={ Select_Mods } isDisabled={ !!Select_Vanilla?.value }
								        classNamePrefix="my-react-select" isMulti={ true } onChange={ setSelect_Mods }/>
							</div>
						</Col>
						<Col sm={ 12 } md={ 4 }>
							<div className={ "bg-dark rounded-2 border mt-2 pt-2" }>
								<span className={ "px-2" }>{ Lang.CreateBlueprint.Tags }</span>
								<Select options={ SelectTags } className="mt-2 my-react-select-container flex-1"
								        value={ Select_Tags }
								        classNamePrefix="my-react-select" isMulti={ true } onChange={ setSelect_Tags }/>
							</div>
						</Col>
					</Row>
					<div className={ "mt-3" }>
						<Button className={ "me-2" } onClick={ DoFetch }>{ Lang.General.Search }</Button>
						<Button variant={ "danger" } onClick={ ResetSearch }>{ Lang.General.ClearSearch }</Button>
					</div>
				</Card.Body>
			</Card>

			<PageManager MaxPage={ TotalPages } OnPageChange={ setCurrentPage } Page={ CurrentPage }
			             Hide={ TotalPages <= 1 }
			             ButtonGroupProps={ { className: "mt-3 w-100 bg-dark" } }
			             ButtonProps={ { size: "sm btn-dark" } }/>
			<Row className={ "px-3 mt-3" }>
				{ Blueprints.map( BP => <BlueprintCard key={ BP._id } Data={ BP } onToggled={ DoFetch }/> ) }
			</Row>
			<PageManager MaxPage={ TotalPages } OnPageChange={ setCurrentPage } Page={ CurrentPage }
			             Hide={ TotalPages <= 1 }
			             ButtonGroupProps={ { className: "mt-3 w-100 bg-dark" } }
			             ButtonProps={ { size: "sm btn-dark" } }/>
		</>
	);
};

export default Home;

import type { FunctionComponent }  from "react";
import {
	useContext,
	useState
}                                  from "react";
import { usePageTitle }            from "@kyri123/k-reactutils";
import LangContext                 from "@context/LangContext";
import type { MO_Blueprint }       from "@shared/Types/MongoDB";
import BlueprintCard               from "@comp/Blueprints/BlueprintCard";
import {
	Button,
	Card,
	Col,
	Form,
	Row
}                                  from "react-bootstrap";
import Ribbon                      from "@comp/General/Ribbon";
import type {
	MultiValue,
	SingleValue
}                                  from "react-select";
import Select                      from "react-select";
import type { SelectOptionStruct } from "@shared/Types/SelectOptions";
import PageManager                 from "@comp/Main/PageManager";
import { useLoaderData }           from "react-router-dom";
import type { IndexLoaderData }    from "@page/Loader";
import {
	tRPC_handleError,
	tRPC_Public
}                                  from "@applib/tRPC";
import { useRawPageHandler }       from "@hooks/useRawPageHandler";
import type { FilterSchema }       from "@server/trpc/routings/public/blueprint";
import { useSelectOptions }        from "@hooks/useSelectOptions";

const Component : FunctionComponent = () => {
	const { blueprints, totalBlueprints } = useLoaderData() as IndexLoaderData;
	const { tagsSelectOptions, modSelectOptions, sortSelectOptions, vanillaSelectOptions } = useSelectOptions();

	const [ TotalBlueprints, setTotalBlueprints ] = useState<number>( () => totalBlueprints );
	const [ Blueprints, setBlueprints ] = useState<MO_Blueprint[]>( () => blueprints );


	const [ filter, setFilter ] = useState<FilterSchema>( {} );

	async function onPageChange( options : { skip : number, limit : number }, newFiler? : FilterSchema ) {
		const queryFilter = { filterOptions: { ...filter, ...newFiler }, ...options };
		const Blueprints = await tRPC_Public.blueprint.getBlueprints.query( queryFilter ).catch( tRPC_handleError );
		if ( Blueprints ) {
			setBlueprints( Blueprints.blueprints );
			setTotalBlueprints( Blueprints.totalBlueprints );
		}
	}

	const { setPage, currentPage, maxPage, filterOption } = useRawPageHandler( TotalBlueprints, onPageChange, 10 );

	const { Lang } = useContext( LangContext );

	const [ BlueprintName, setBlueprintName ] = useState<string>( "" );
	const [ Select_Sorting, setSelect_Sorting ] = useState<SingleValue<SelectOptionStruct<FilterSchema["sortBy"]>>>( null );
	const [ Select_Vanilla, setSelect_Vanilla ] = useState<SingleValue<SelectOptionStruct<boolean>>>( null );
	const [ Select_Mods, setSelect_Mods ] = useState<MultiValue<SelectOptionStruct>>( [] );
	const [ Select_Tags, setSelect_Tags ] = useState<MultiValue<SelectOptionStruct>>( [] );

	usePageTitle( `SBS - ${ Lang.Navigation.Home }` );

	const DoFetch = async() => {
		const filter : FilterSchema = {
			sortBy: Select_Sorting?.value || undefined,
			name: BlueprintName !== "" ? BlueprintName : undefined,
			onlyVanilla: Select_Vanilla?.value || undefined,
			mods: Select_Mods.length > 0 ? Select_Mods.map( e => e.value ) : undefined,
			tags: Select_Tags.length > 0 ? Select_Tags.map( e => e.value ) : undefined
		};
		setFilter( filter );
		await onPageChange( filterOption, filter );
	};

	const ResetSearch = async() => {
		setBlueprintName( "" );
		setSelect_Tags( [] );
		setSelect_Mods( [] );
		setSelect_Vanilla( null );
		setSelect_Sorting( null );
		setFilter( {} );
		await onPageChange( filterOption, {
			sortBy: undefined,
			name: undefined,
			onlyVanilla: undefined,
			mods: undefined,
			tags: undefined
		} );
	};

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
								<Select options={ sortSelectOptions } className="mt-2 my-react-select-container flex-1"
								        classNamePrefix="my-react-select" isMulti={ false } value={ Select_Sorting }
								        onChange={ setSelect_Sorting }/>
							</div>
						</Col>
					</Row>
					<Row>
						<Col sm={ 12 } md={ 4 }>
							<div className={ "bg-dark rounded-2 border mt-2 pt-2" }>
								<span className={ "px-2" }>{ Lang.General.FilterMods }</span>
								<Select options={ vanillaSelectOptions }
								        className="mt-2 my-react-select-container flex-1"
								        value={ Select_Vanilla } isClearable={ true }
								        classNamePrefix="my-react-select" onChange={ setSelect_Vanilla }/>
							</div>
						</Col>
						<Col sm={ 12 } md={ 4 }>
							<div className={ "bg-dark rounded-2 border mt-2 pt-2" }>
								<span className={ "px-2" }>{ Lang.CreateBlueprint.Mods }</span>
								<Select options={ modSelectOptions } className="mt-2 my-react-select-container flex-1"
								        value={ Select_Mods } isDisabled={ !!Select_Vanilla?.value }
								        classNamePrefix="my-react-select" isMulti={ true } onChange={ setSelect_Mods }/>
							</div>
						</Col>
						<Col sm={ 12 } md={ 4 }>
							<div className={ "bg-dark rounded-2 border mt-2 pt-2" }>
								<span className={ "px-2" }>{ Lang.CreateBlueprint.Tags }</span>
								<Select options={ tagsSelectOptions } className="mt-2 my-react-select-container flex-1"
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

			<PageManager MaxPage={ maxPage } OnPageChange={ setPage } Page={ currentPage }
			             Hide={ maxPage <= 1 }
			             ButtonGroupProps={ { className: "mt-3 w-100 bg-dark" } }
			             ButtonProps={ { size: "sm", className: "btn-dark" } }/>
			<Row className={ "px-3 mt-3" }>
				{ Blueprints.map( BP => <BlueprintCard key={ BP._id } Data={ BP } onToggled={ DoFetch }/> ) }
			</Row>
			<PageManager MaxPage={ maxPage } OnPageChange={ setPage } Page={ currentPage }
			             Hide={ maxPage <= 1 }
			             ButtonGroupProps={ { className: "mt-3 w-100 bg-dark" } }
			             ButtonProps={ { size: "sm", className: "btn-dark" } }/>
		</>
	);
};

export { Component };

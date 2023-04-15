import {
	FunctionComponent,
	useContext,
	useEffect,
	useState
}                        from "react";
import { usePageTitle }  from "@kyri123/k-reactutils";
import LangContext       from "../Context/LangContext";
import { API_QueryLib }  from "../Lib/Api/API_Query.Lib";
import { EApiBlueprint } from "../Shared/Enum/EApiPath";
import {
	TResponse_BP_Get,
	TResponse_BP_Num
}                        from "../Shared/Types/API_Response";
import {
	TRequest_BP_Get,
	TRequest_BP_Num
}                        from "../Shared/Types/API_Request";
import { IMO_Blueprint } from "../Shared/Types/MongoDB";
import BlueprintCard     from "../Components/Home/BlueprintCard";
import { Row }           from "react-bootstrap";

const Home : FunctionComponent = () => {
	const { Lang } = useContext( LangContext );
	usePageTitle( `SBS - ${ Lang.Navigation.Home }` );

	const [ TotalPages, setTotalPages ] = useState( 0 );
	const [ CurrentPage, setCurrentPage ] = useState( 0 );
	const [ Total, setTotal ] = useState( 0 );
	const [ Blueprints, setBlueprints ] = useState<IMO_Blueprint[]>( [] );


	useEffect( () => {
		const DoFetch = async() => {
			const [ CountQuery, Blueprints ] = await Promise.all( [
				API_QueryLib.PostToAPI<TResponse_BP_Num, TRequest_BP_Num>( EApiBlueprint.num, {} ),
				API_QueryLib.PostToAPI<TResponse_BP_Get, TRequest_BP_Get>( EApiBlueprint.get, {
					Options: {
						limit: 15,
						skip: CurrentPage * 15
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
		DoFetch().then( () => {
		} );
	}, [ CurrentPage ] );

	return (
		<Row>
			{ Blueprints.map( BP => <BlueprintCard key={ BP._id } Data={ BP }/> ) }
		</Row>
	);
};

export default Home;

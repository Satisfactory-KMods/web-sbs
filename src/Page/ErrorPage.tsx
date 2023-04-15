import {
	FunctionComponent,
	useContext
}                       from "react";
import { Link }         from "react-router-dom";
import LangContext      from "../Context/LangContext";
import { usePageTitle } from "@kyri123/k-reactutils";

interface IErrorPageProps {
	ErrorCode : 401 | 403 | 404;
}


const ErrorPage : FunctionComponent<IErrorPageProps> = ( { ErrorCode } ) => {
	const { Lang } = useContext( LangContext );
	usePageTitle( `SBS - Error ${ ErrorCode }` );

	return (
		<div className={ "d-flex h-100 justify-content-center" }>
			<div className={ "align-self-center d-flex bg-gray-800 p-5 border rounded-4" }>
				<div className={ "d-inline text-6xl pe-4 text-danger align-middle" }>{ ErrorCode }</div>
				<div className={ "d-inline text-lg" }>
					<span className={ "d-block text-xl" }>{ Lang.ErrorPage.ErrorTitle }</span>
					<span className={ "d-block" }>{ Lang.ErrorPage[ `Err${ ErrorCode }` ] }</span>
					<span className={ "d-block" }>
						<Link to={ "/" } className={ "btn btn-secondary mt-3" }>{ Lang.ErrorPage.BackToHome }</Link>
					</span>
				</div>
			</div>
		</div>
	);
};

export default ErrorPage;

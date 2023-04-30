import type {
	FunctionComponent} from "react";
import {
	useContext
}                       from "react";
import {
	Link,
	useParams
}                       from "react-router-dom";
import LangContext      from "@context/LangContext";
import { usePageTitle } from "@kyri123/k-reactutils";


const Component : FunctionComponent = () => {
	const { statusCode } = useParams<{ statusCode : string }>();
	const { Lang } = useContext( LangContext );
	usePageTitle( `SBS - Error ${ statusCode }` );

	let errorText = Lang.ErrorPage.Err404;
	switch ( statusCode ) {
		case "401":
			errorText = Lang.ErrorPage.Err401;
			break;
		case "403":
			errorText = Lang.ErrorPage.Err403;
			break;
	}

	return (
		<div className={ "d-flex h-100 justify-content-center" }>
			<div className={ "align-self-center d-flex bg-gray-800 p-5 border rounded-4" }>
				<div className={ "d-inline text-6xl pe-4 text-danger align-middle" }>{ statusCode }</div>
				<div className={ "d-inline text-lg" }>
					<span className={ "d-block text-xl" }>{ Lang.ErrorPage.ErrorTitle }</span>
					<span className={ "d-block" }>{ errorText }</span>
					<span className={ "d-block" }>
						<Link to={ "/" } className={ "btn btn-secondary mt-3" }>{ Lang.ErrorPage.BackToHome }</Link>
					</span>
				</div>
			</div>
		</div>
	);
};

export { Component };

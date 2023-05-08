import type { FunctionComponent } from "react";
import {
	Link,
	useParams
}                                 from "react-router-dom";
import { usePageTitle }           from "@kyri123/k-reactutils";

const Component : FunctionComponent = () => {
	const { statusCode } = useParams<{ statusCode : string }>();
	usePageTitle( `SBS - Error ${ statusCode }` );

	let errorText = "Unfortunately, this action is not allowed for you.";
	switch ( statusCode ) {
		case "401":
			errorText = "Unfortunately, this action is not allowed for you.";
			break;
		case "403":
			errorText = "Unfortunately, this action is not allowed for you.";
			break;
	}

	return (
		<div className={ "d-flex h-100 justify-content-center" }>
			<div className={ "align-self-center d-flex bg-gray-800 p-5 border rounded-4" }>
				<div className={ "d-inline text-6xl pe-4 text-danger align-middle" }>{ statusCode }</div>
				<div className={ "d-inline text-lg" }>
					<span className={ "d-block text-xl" }>We are sorry...</span>
					<span className={ "d-block" }>{ errorText }</span>
					<span className={ "d-block" }>
						<Link to={ "/" } className={ "btn btn-secondary mt-3" }>Back to home</Link>
					</span>
				</div>
			</div>
		</div>
	);
};

export { Component };

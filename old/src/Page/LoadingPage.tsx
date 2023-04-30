import { FunctionComponent } from "react";
import { usePageTitle }      from "@kyri123/k-reactutils";

const LoadingPage : FunctionComponent = () => {
	usePageTitle( `SBS - Loading...` );

	return (
		<></>
	);
};

export default LoadingPage;

import {
	FunctionComponent,
	useContext
}                       from "react";
import { usePageTitle } from "@kyri123/k-reactutils";
import LangContext      from "../Context/LangContext";

const Home : FunctionComponent = () => {
	const { Lang } = useContext( LangContext );
	usePageTitle( `SBS - ${ Lang.Navigation.Home }` );

	return (
		<></>
	);
};

export default Home;

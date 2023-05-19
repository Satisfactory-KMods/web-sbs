import BlueprintPackEditor from "@app/Components/packs/BlueprintPackEditor";
import type { BlueprintPackDefaultLoader } from "@app/Lib/loaderHelper";
import { usePageTitle } from "@kyri123/k-reactutils";
import type { FunctionComponent } from "react";
import {
	useLoaderData
} from "react-router-dom";


const Component: FunctionComponent = () => {
	usePageTitle( `SBS - Edit Blueprint Pack` );
	const { blueprintPack } = useLoaderData() as BlueprintPackDefaultLoader;
	return <BlueprintPackEditor blueprintPack={ blueprintPack } />;
};

export {
	Component
};


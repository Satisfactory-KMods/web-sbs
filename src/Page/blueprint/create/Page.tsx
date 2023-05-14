import BlueprintEditor from "@app/Components/Blueprints/BlueprintEditor";
import { usePageTitle } from "@kyri123/k-reactutils";
import type {
	FunctionComponent
} from "react";

export interface IFile {
	Content: FileList | undefined,
	FileName: string
}

const Component: FunctionComponent = () => {
	usePageTitle( `SBS - Create Blueprints` );
	return <BlueprintEditor />;
};

export {
	Component
};


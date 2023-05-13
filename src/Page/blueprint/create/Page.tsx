import BlueprintEditor from "@app/Components/Blueprints/BlueprintEditor";
import type {
	FunctionComponent
} from "react";

export interface IFile {
	Content: FileList | undefined,
	FileName: string
}

const Component: FunctionComponent = () => {
	const onSaved = async() => {
	};

	return <BlueprintEditor onSaved={ onSaved } />;
};

export {
	Component
};


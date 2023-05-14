import BlueprintEditor from "@app/Components/Blueprints/BlueprintEditor";
import type { BlueprintIdLoader } from "@app/Page/blueprint/edit/[blueprintId]Loader";
import type {
	FunctionComponent
} from "react";
import { useLoaderData } from "react-router-dom";

const Component: FunctionComponent = () => {
	const { blueprintData, blueprint } = useLoaderData() as BlueprintIdLoader;
	return <BlueprintEditor defaultBlueprintData={ blueprint } defaultData={ blueprintData } />;
};

export {
	Component
};


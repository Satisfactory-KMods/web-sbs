import type { BlueprintPackDefaultLoader } from '@applib/loaderHelper';
import { LoginRule, validateBlueprintPack } from '@applib/loaderHelper';
import type { LoaderFunction } from 'react-router-dom';
import { json } from 'react-router-dom';

export type BlueprintPackIdLoader = BlueprintPackDefaultLoader;

const loader: LoaderFunction = async ({ params, request }) => {
	const result = await validateBlueprintPack({ params, request }, '/error/401', LoginRule.BlueprintOwner);
	if (result instanceof Response) {
		return result;
	}

	return json<BlueprintPackDefaultLoader>(result);
};

export { loader };

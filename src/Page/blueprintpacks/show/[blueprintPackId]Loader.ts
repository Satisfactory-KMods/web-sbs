import type { BlueprintPackDefaultLoader } from '@applib/loaderHelper';
import { validateBlueprintPack } from '@applib/loaderHelper';
import type { LoaderFunction } from 'react-router-dom';
import { json } from 'react-router-dom';

const loader: LoaderFunction = async ({ params, request }) => {
	const result = await validateBlueprintPack({ params, request }, '/error/404');
	if (result instanceof Response) {
		return result;
	}

	return json<BlueprintPackDefaultLoader>(result);
};

export { loader };

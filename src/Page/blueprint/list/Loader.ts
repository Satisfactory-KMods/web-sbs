import type { LoaderDataBase } from '@app/Types/loader';
import { validateLogin } from '@applib/loaderHelper';
import { tRPCHandleError, tRPCPublic } from '@applib/tRPC';
import type { BlueprintData } from '@server/MongoDB/MongoBlueprints';
import type { LoaderFunction } from 'react-router-dom';
import { json } from 'react-router-dom';

export type IndexLoaderData = LoaderDataBase & {
	blueprints: BlueprintData[];
	totalBlueprints: number;
};

export const loader: LoaderFunction = async ({ params, request }) => {
	const result = await validateLogin({ params, request });
	if (result instanceof Response) {
		return result;
	}
	const Blueprints = await tRPCPublic.blueprint.getBlueprints.query({ limit: 12 }).catch(tRPCHandleError);
	let blueprints: BlueprintData[] = [];
	let totalBlueprints = 0;
	if (Blueprints) {
		blueprints = Blueprints.blueprints;
		totalBlueprints = Blueprints.totalBlueprints;
	}

	return json<IndexLoaderData>({ ...result, blueprints, totalBlueprints });
};

import type { IndexLoaderData } from '@app/Page/blueprint/list/Loader';
import { validateLogin } from '@applib/loaderHelper';
import { tRPCHandleError, tRPCPublic } from '@applib/tRPC';
import type { BlueprintData } from '@server/MongoDB/MongoBlueprints';
import type { ClientUserAccount } from '@server/MongoDB/MongoUserAccount';
import type { LoaderFunction } from 'react-router-dom';
import { json, redirect } from 'react-router-dom';

export type UserBlueprintLoaderData = IndexLoaderData & {
	showUser: ClientUserAccount;
};

export const loader: LoaderFunction = async ({ params, request }) => {
	const { owner } = params;
	if (!owner) {
		return redirect('/error/404');
	}
	const result = await validateLogin({ params, request });
	if (result instanceof Response) {
		return result;
	}
	const [Blueprints, showUser] = await Promise.all([
		tRPCPublic.blueprint.getBlueprints.query({ limit: 20, owner }).catch(tRPCHandleError),
		tRPCPublic.user.getUser.query({ userId: owner! }).catch(tRPCHandleError)
	]);

	if (!showUser || !Blueprints) {
		return redirect('/error/404');
	}

	let blueprints: BlueprintData[] = [];
	let totalBlueprints = 0;
	if (Blueprints) {
		blueprints = Blueprints.blueprints;
		totalBlueprints = Blueprints.totalBlueprints;
	}

	return json<UserBlueprintLoaderData>({ ...result, blueprints, totalBlueprints, showUser });
};

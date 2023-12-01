import { BlueprintClass } from '@/server/src/Lib/Blueprint.Class';
import MongoUserAccount from '@/server/src/MongoDB/MongoUserAccount';
import type { EApiBlueprintUtils } from '@/src/Shared/Enum/EApiPath';
import { errorResponse } from '@kyri123/lib';
import MongoSessionToken from '@server/MongoDB/MongoSessionToken';
import { User } from '@shared/Class/User.Class';
import type { ERoles } from '@shared/Enum/ERoles';
import fs from 'fs';
import * as jwt from 'jsonwebtoken';
import _ from 'lodash';

export function ApiUrl(Url: EApiBlueprintUtils | string) {
	const EndUrl = `/api/v1/${Url}`;
	SystemLib.Log('URL', 'Routing registered:', SystemLib.ToBashColor('Red'), EndUrl);
	return EndUrl;
}

export async function MWAuth(req: any, res: any, next: any) {
	const AuthHeader = req.headers['authorization'];
	let Token: string | undefined = undefined;
	try {
		Token = AuthHeader && AuthHeader.split(' ')[1].replaceAll('"', '');
	} catch (e) {}

	if (Token) {
		try {
			const Result = jwt.verify(Token, process.env.JWTToken as string);
			if (typeof Result === 'object') {
				const UserData = new User(Token);
				const Session = await MongoSessionToken.findOne({ token: Token, userid: UserData.Get._id });
				if (Session) {
					req.body.UserClass = UserData;
					next();
					return;
				}
			}
		} catch (e) {
			/*if( e instanceof Error ) {
				SystemLib.LogError( "middleware Auth", e.message );
			}*/
		}
	}
	return res.status(401).json(errorResponse('Unauthorized', res));
}

export async function MWCleanMulterCache(req: any, res: any, next: any) {
	if (req.files) {
		if (Array.isArray(req.files)) {
			for (const file of req.files) {
				fs.existsSync(file.path) && fs.rmSync(file.path, { recursive: true });
			}
		} else {
			for (const fileCluster of Object.values<any>(req.files)) {
				for (const file of fileCluster) {
					fs.existsSync(file.path) && fs.rmSync(file.path, { recursive: true });
				}
			}
		}
	}
	next();
}

export async function MWPermission(req: any, res: any, next: any, Permission: ERoles) {
	if (req.body.UserClass && req.body.UserClass.HasPermission(Permission)) {
		next();
		return;
	}
	return res.status(401).json(errorResponse('Unauthorized', res));
}

export async function MWBlueprint(req: any, res: any, next: any) {
	if (req.body.blueprintName && req.body.blueprint && req.body.blueprintId && typeof req.body.blueprintId === 'string') {
		const server = await BlueprintClass.createClass(req.body.blueprintId);
		if (server && req.body.UserClass) {
			if (server.isOwner(req.body.UserClass?.Get._id)) {
				req.body.blueprintId = server;
				return next();
			}
		}
	}
	return res.status(401).json(errorResponse('Unauthorized', res));
}

export async function MWRest(req: any, res: any, next: any) {
	const apiKey = req.header('x-api-key');
	if (_.isEqual(apiKey, process.env.APIKey) && process.env.APIKey) {
		return next();
	} else if (!process.env.APIKey) {
		SystemLib.LogFatal('MOD', 'No API Key provided');
	}
	return res.status(401).json({ error: 'Unauthorized' });
}

export async function MWRestUser(req: any, res: any, next: any) {
	const apiKey = req.header('x-account-key');
	if (apiKey) {
		const userDoc = await MongoUserAccount.findOne({ apiKey });
		if (userDoc) {
			req.body.user = userDoc.toJSON();
			return next();
		}
	}
	return res.status(401).json({ error: 'Unauthorized' });
}

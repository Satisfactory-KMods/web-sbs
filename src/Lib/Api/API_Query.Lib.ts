import { fireSwalFromApi, tRPCToken } from '@app/Lib/tRPC';
import type { ErrorDataResponseFormat, SuccessDataResponseFormat } from '@kyri123/lib';
import type { EApiBlueprintUtils } from '@shared/Enum/EApiPath';
import superjson from 'superjson';
import type { SuperJSONResult } from 'superjson/dist/types';

export class apiQueryLib {
	static async PostToAPI<T, D = any>(
		Path: EApiBlueprintUtils,
		Data: D,
		ContentType?: 'application/json' | 'application/x-www-form-urlencoded' | 'multipart/form-data'
	): Promise<T> {
		const requestOptions: RequestInit = {
			method: 'POST',
			headers: {
				'Authorization': 'Bearer ' + tRPCToken(),
				'User-Agent': 'Frontend'
			},
			body: Data instanceof FormData ? Data : JSON.stringify(Data)
		};

		if (!(Data instanceof FormData)) {
			// @ts-ignore
			requestOptions.headers['Content-Type'] = ContentType || 'application/json';
		}

		try {
			const Resp: Response = await fetch(`/api/v1/${Path}`, requestOptions);
			if (Resp) {
				const resultJson = (await Resp.json()) as SuccessDataResponseFormat | { error: SuperJSONResult };
				if (Resp.status === 200) {
					return superjson.parse(JSON.stringify((resultJson as SuccessDataResponseFormat).result.data)) as T;
				} else {
					const result = superjson.parse(JSON.stringify((resultJson as { error: SuperJSONResult }).error)) as ErrorDataResponseFormat;
					fireSwalFromApi(result.message || 'Something goes wrong!');
				}
			}
		} catch (e) {
			console.error(e);
		}

		throw new Error('Request failed');
	}

	static async GetFromAPI<T, D = any>(Path: EApiBlueprintUtils, Data: D): Promise<T> {
		const RequestData: string[] = [];

		if (Data) {
			if (typeof Data === 'object' && !Array.isArray(Data)) {
				for (const [Key, Value] of Object.entries(Data)) {
					RequestData.push(`${Key}=${Value}`);
				}
			}
		}

		const requestOptions: RequestInit = {
			method: 'GET',
			headers: {
				'Authorization': 'Bearer ' + tRPCToken(),
				'User-Agent': 'Frontend',
				'Content-Type': 'application/json'
			}
		};

		try {
			const Resp: Response = await fetch(`/api/v1/${Path}`, requestOptions);
			if (Resp) {
				const resultJson = (await Resp.json()) as SuccessDataResponseFormat | { error: SuperJSONResult };
				if (Resp.status === 200) {
					return superjson.parse(JSON.stringify((resultJson as SuccessDataResponseFormat).result.data)) as T;
				} else {
					const result = superjson.parse(JSON.stringify((resultJson as { error: SuperJSONResult }).error)) as ErrorDataResponseFormat;
					fireSwalFromApi(result.message || 'Something goes wrong!');
				}
			}
		} catch (e) {
			console.error(e);
		}

		throw new Error('Request failed');
	}
}

import type { NextRequest } from 'next/server';

type Data<T = any> = { [P in keyof T]: T[P] extends any[] ? string : T[P] };

export function getSearchParams<T = any>(req: NextRequest, defaults: T, skipInvalidKeys?: boolean): Data<T> {
	const { searchParams } = new URL(req.url);
	const data = Object.fromEntries(searchParams.entries());
	const outData: any = defaults;
	const keys: any = Object.keys(outData);

	for (const [key, value] of Object.entries(data)) {
		if (!skipInvalidKeys && !keys.includes(key)) {
			throw new Error(`Invalid key '${key}'`);
		}

		if (typeof outData[key] === 'boolean') {
			outData[key] = value !== 'false';
			continue;
		}

		if (outData[key] instanceof Array) {
			if (!outData[key][0].includes(value)) {
				throw new Error(`Invalid value '${value}' for '${key}'`);
			}
			outData[key] = value;
			continue;
		}

		if (typeof outData[key] === 'number') {
			outData[key] = parseInt(value as string);
			if (isNaN(outData[key])) {
				throw new Error(`Invalid number for '${key}'`);
			}
			continue;
		}
		outData[key] = value;
	}

	for (const [key, value] of Object.entries<any>(outData)) {
		if (outData[key] instanceof Array) {
			outData[key] = value[1];
			continue;
		}
	}

	if (data.limit) {
		outData.limit = parseInt(data.limit as string);
	}

	return outData;
}

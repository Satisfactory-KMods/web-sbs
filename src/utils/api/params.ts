import { headers } from 'next/headers';
import type { NextRequest } from 'next/server';

type Data<T = any> = { [P in keyof T]: T[P] extends any[] ? string : T[P] };

export function getSearchParams<T = any>(req: NextRequest, defaults: T, noThrow = true, skipInvalidKeys?: boolean): Data<T> {
	const { searchParams } = new URL(req.url);
	const data = Object.fromEntries(searchParams.entries());
	return getPageSearchParams(data, defaults, noThrow, skipInvalidKeys);
}

export function getPageSearchParams<T = any>(searchParams: any, defaults: T, noThrow = true, skipInvalidKeys?: boolean): Data<T> {
	const data = searchParams;
	const outData: any = defaults;
	const keys: any = Object.keys(outData);

	for (const [key, value] of Object.entries(data)) {
		if (!skipInvalidKeys && !keys.includes(key)) {
			if (!noThrow) throw new Error(`Invalid key '${key}'`);
			else {
				console.error(`Invalid key '${key}'`);
				continue;
			}
		}

		if (typeof outData[key] === 'boolean') {
			outData[key] = value !== 'false';
			continue;
		}

		if (outData[key] instanceof Array) {
			if (!outData[key][0].includes(value)) {
				if (!noThrow) throw new Error(`Invalid value '${value}' for '${key}'`);
				else {
					console.error(`Invalid value '${value}' for '${key}'`);
					continue;
				}
			}
			outData[key] = value;
			continue;
		}

		if (typeof outData[key] === 'number') {
			outData[key] = parseInt(value as string);
			if (isNaN(outData[key])) {
				if (!noThrow) throw new Error(`Invalid number for '${key}'`);
				else {
					console.error(`Invalid number for '${key}'`);
					continue;
				}
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

export function toSearchParamString(data: any, suffix = '?') {
	const params = new URLSearchParams();
	for (const [key, value] of Object.entries<any>(data)) {
		if (value instanceof Array) {
			params.append(key, value[0]);
			continue;
		}
		params.append(key, value.toString());
	}
	return suffix + params.toString();
}

export class SearchParamHandler {
	private searchParams = new URLSearchParams();

	constructor(data: any) {
		for (const [key, value] of Object.entries<any>(data)) {
			if (value instanceof Array) {
				this.searchParams.append(key, value[0]);
				continue;
			}
			this.searchParams.append(key, value.toString());
		}
	}

	set(key: string, value: any) {
		this.searchParams.set(key, value);
	}

	get(key: string) {
		this.searchParams.get(key);
	}

	string(withoutSuffix = false) {
		return (withoutSuffix ? '' : '?') + this.searchParams.toString();
	}
}

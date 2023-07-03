import { SearchParamHandler } from '@/utils/api/params';
import type { ReadonlyHeaders } from 'next/dist/server/web/spec-extension/adapters/headers';

export function apiUrl(headers: ReadonlyHeaders, v: 1 | 2, url: string, searchParams: object) {
	const fetchParams = new SearchParamHandler(searchParams);
	return `${headers.get('x-forwarded-proto') || 'http'}://${headers.get('host')}/api/v${v}/${url}${fetchParams.string()}`;
}

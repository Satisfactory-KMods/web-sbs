import type {
	ExtractedRouteMethod,
	NitroFetchOptions,
	NitroFetchRequest,
	TypedInternalResponse
} from 'nitropack';

/**
 * $$fetch is a wrapper around $fetch that adds the default headers to the request.
 * @param url - The URL to fetch.
 * @param params - The fetch parameters.
 * @param rest - The rest of the parameters.
 * @returns The fetch response.
 */
export function $$fetch<
	T = unknown,
	TUrl extends NitroFetchRequest = NitroFetchRequest,
	TOptions extends NitroFetchOptions<TUrl> = NitroFetchOptions<TUrl>
>(
	url: TUrl,
	params?: TOptions
): Promise<TypedInternalResponse<TUrl, T, ExtractedRouteMethod<TUrl, TOptions>>> {
	if (!params) {
		params = {} as any;
	}

	if (!params!.headers) {
		params!.headers = useRequestHeaders();
	} else {
		params!.headers = { ...useRequestHeaders(), ...params!.headers };
	}

	return $fetch<T, TUrl>(url as any, params as any).catch((e) => {
		throw createError({
			statusCode: 500,
			message: e.message
		});
	}) as any;
}

import type { RouteParamsRaw } from '#vue-router';
import type { Simplify } from '@kmods/drizzle-pg';
import cloneDeep from 'lodash/cloneDeep';
import isEqual from 'lodash/isEqual';

export type MakeEmptyable<T> = {
	[K in keyof T]: T[K] | null;
} & {};

export type MergeObjectTypes<T, U> = Simplify<{
	[K in keyof T]: K extends keyof U ? T[K] | U[K] : T[K];
}>;

export function EmptyOrNull(value: unknown): boolean {
	return value === null || value === undefined || value === '';
}

export function SafeNumber<T = number>(value: unknown, fallback = -1): T {
	const result = Number(value);
	if (Number.isNaN(result as any) || EmptyOrNull(value)) return fallback as any;
	return result as any;
}

export function SafeString<T = string>(value: unknown, fallback = ''): T {
	return (EmptyOrNull(value) ? fallback : String(value)) as any;
}

export function FallBack<T>(a: T, b: NoInfer<T>): T {
	return EmptyOrNull(a) ? b : a;
}

export type ExtendableParams<T, TTypes = string> = Simplify<
	T & {
		[key: string]: TTypes;
	}
>;

type ParamsOptions<
	T extends RouteParamsRaw = Record<string, string>,
	CustomParser extends object | undefined = undefined
> = {
	values?: T;
	event?: (keys: (keyof NoInfer<T> | string)[]) => void;
	eventKeys?: (keyof NoInfer<T> | string)[];
	customParser?: (params: NoInfer<T>) => CustomParser;
	routeMode?: 'replace' | 'push';
	reactiveRoute?: boolean;
};

function createQueryHandler<TType extends 'params' | 'query'>(type: TType) {
	return function handler<
		T extends RouteParamsRaw = Record<string, string>,
		CustomParser extends object | undefined = undefined
	>({
		values,
		event = () => {},
		customParser,
		eventKeys,
		reactiveRoute = true,
		routeMode
	}: ParamsOptions<T, CustomParser> = {}) {
		const route = useRoute();
		const router = useRouter();

		function getRouteMode(): 'replace' | 'push' {
			if (typeof routeMode === 'string') return routeMode;
			return type === 'params' ? 'push' : 'replace';
		}

		function applyParser(params: any): any {
			return cloneDeep(customParser ? customParser(params) : params);
		}

		const params = reactive<
			ExtendableParams<CustomParser extends undefined ? T : CustomParser>
		>(
			applyParser({
				...(values ?? {}),
				...(cloneDeep(route[type]) as any)
			})
		);

		function triggerEvent(updatedKeys: (keyof T | string)[]) {
			if (!event || !updatedKeys.length) return;

			if (eventKeys?.length) {
				const keys = updatedKeys.filter((key) => {
					return eventKeys.includes(key);
				});
				if (keys.length > 0) event(updatedKeys);
			} else {
				event(updatedKeys);
			}
		}

		watch(
			() => {
				return params;
			},
			(to) => {
				// unref the params to get the raw values
				const raw = toRaw(unref(to));

				triggerEvent(
					// filter the keys that are different
					Object.entries(raw)
						.map(([k, v]) => {
							// convert the value back to string for comparison
							// we might have a custom parser that converts the value to a different type
							// so we need to convert it back to string for comparison
							return [k, String(v)];
						})
						.reduce<(keyof T | string)[]>((acc, [key, value]) => {
							// check if the key is in the route and if the value is different or nullish
							if (
								!isEqual(route[type][key], value) ||
								route[type][key] === null ||
								route[type][key] === undefined
							) {
								acc.push(key);
							}
							return acc;
						}, [])
				);

				// if the route is not reactive we don't need to update the route
				if (!reactiveRoute) return;
				const applyParams =
					type === 'params'
						? {
								params: raw,
								query: route.query,
								hash: route.hash
							}
						: {
								params: route.params,
								query: { ...route.query, ...raw },
								hash: route.hash
							};

				// now we can update the route
				router[getRouteMode()](applyParams as any);
			},
			{ deep: true }
		);

		watch(
			() => {
				if (type === 'query') {
					return route.query;
				}
				return route.params;
			},
			refreshParams,
			{ deep: true }
		);

		function refreshParams() {
			Object.assign(params, applyParser({ ...(values ?? {}), ...route[type] }));
		}

		return params;
	};
}

function createQueryHandlerWithSetter<TType extends 'params' | 'query'>(type: TType) {
	return function handler<
		T extends RouteParamsRaw = Record<string, string>,
		CustomParser extends object | undefined = undefined
	>(options: ParamsOptions<T, CustomParser> = {}) {
		const params = createQueryHandler(type)(options);

		function setParams(
			value: Partial<
				NoInfer<
					MakeEmptyable<
						ExtendableParams<
							CustomParser extends undefined ? T : CustomParser,
							string | number | boolean
						>
					>
				>
			>
		) {
			Object.assign(params, value);
		}

		function clearParms() {
			Object.keys(params).forEach((key) => {
				// @ts-ignore
				delete params[key];
			});
		}
		function hasValue<
			TKey extends keyof ExtendableParams<CustomParser extends undefined ? T : CustomParser>
		>(
			key: TKey,
			value: ExtendableParams<CustomParser extends undefined ? T : CustomParser>[TKey]
		) {
			if (key in params) {
				// @ts-ignore
				return params[key] === value;
			}
			return false;
		}

		return { params, reffer: toRef(params), setParams, clearParms, hasValue };
	};
}

/**
 * Reactively watch the params of the current route
 * @param values default params to set
 * @param event event to call when the params are updated
 * @return params and event as ref z
 * @example ```ts
 * --> params = { page: number} because of customParser convert the page to number
 * const { params } = useParams({
 *      values: { page: '0' },
 *      event: () => {
 *          console.log('params updated', params);
 *      },
 * 		customParser: ({page}) => ({
 * 			page: SafeNumber(page, 1)
 * 		}),
 * });
 *
 * <input class="form-control" v-model="params.page" />
 * ```
 */
export const useParams = createQueryHandler('params');
/**
 * Reactively watch the params of the current route
 * @param values default params to set
 * @param event event to call when the params are updated
 * @return params and event as ref z
 * @example ```ts
 * --> params = { page: number} because of customParser convert the page to number
 * const params = useParamsSetter({
 *      values: { page: '0' },
 *      event: () => {
 *          console.log('params updated', params);
 *      },
 * 		customParser: ({page}) => ({
 * 			page: SafeNumber(page, 1)
 * 		}),
 * });
 *
 * <input class="form-control" v-model="params.page" />
 * ```
 */
export const useParamsSetter = createQueryHandlerWithSetter('params');

/**
 * Reactively watch the params of the current route
 * @param values default params to set
 * @param event event to call when the params are updated
 * @return params and event as ref z
 * @example ```ts
 * --> params = { page: number} because of customParser convert the page to number
 * const { params } = useSearchParams({
 *      values: { page: '0' },
 *      event: () => {
 *          console.log('params updated', params);
 *      },
 * 		customParser: ({page}) => ({
 * 			page: SafeNumber(page, 1)
 * 		}),
 * });
 *
 * <input class="form-control" v-model="params.page" />
 * ```
 */
export const useSearchParams = createQueryHandler('query');
/**
 * Reactively watch the params of the current route
 * @param values default params to set
 * @param event event to call when the params are updated
 * @return params and event as ref z
 * @example ```ts
 * --> params = { page: number} because of customParser convert the page to number
 * const params = useSearchParamsSetter({
 *      values: { page: '0' },
 *      event: () => {
 *          console.log('params updated', params);
 *      },
 * 		customParser: ({page}) => ({
 * 			page: SafeNumber(page, 1)
 * 		}),
 * });
 *
 * <input class="form-control" v-model="params.page" />
 * ```
 */
export const useSearchParamsSetter = createQueryHandlerWithSetter('query');

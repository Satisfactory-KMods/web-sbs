import type { NextApiRequest, NextApiResponse } from 'next';
import type { Session } from 'next-auth';
import type { NextRequest } from 'next/server';

type ArrayElement<ArrayType extends readonly unknown[]> = ArrayType extends readonly (infer ElementType)[] ? ElementType : never;

export type NextAppPage<Props = any, SearchParams = any> = (props: { params: Props; searchParams: Partial<SearchParams> }) => React.ReactElement | Promise<React.ReactElement>;
export type NextContext<Params = any> = {
	params: Params;
};
export type NextRoute<Params = any> = (request: NextRequest, context: NextContext<Params>) => Promise<NextResponse | void>;

export interface NextPageApiRequest<Params = any, Body = any, Cookies = any> extends NextApiRequest {
	query: Partial<{
		[key: string]: string | string[];
	}> &
		Params;
	cookies: Partial<{
		[key: string]: string | string[];
	}> &
		Cookies;
	body: Body;
}

export type NextPageRoute<Params = any, Body = any, Data = any, Cookies = any> = (req: NextPageApiRequest<Params, Body, Cookies>, res: NextApiResponse<Data>) => any;

interface SC<P = any> {
	(props: P, context?: any): Promise<React.ReactElement> | React.ReactElement;
	propTypes?: WeakValidationMap<P> | undefined;
	contextTypes?: ValidationMap<any> | undefined;
	defaultProps?: Partial<P> | undefined;
	displayName?: string | undefined;
}

type NextOptionsType = {
	dynamic: 'auto' | 'force-dynamic' | 'error' | 'force-static';
	dynamicParams: boolean;
	revalidate: false | 'force-cache' | 0 | number;
	fetchCache: 'auto' | 'default-cache' | 'only-cache' | 'force-cache' | 'force-no-store' | 'default-no-store' | 'only-no-store';
	runtime: 'nodejs' | 'edge';
	preferredRegion: 'auto' | 'global' | 'home' | string | string[];
};

export type NextAuthSession = Session | null | undefined;
export type NextOptions<T extends keyof NextOptionsType> = NextOptionsType[T];

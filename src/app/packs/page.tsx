import type { NextAppPage } from '@/types/Next';
import { SearchParamHandler, getPageSearchParams } from '@/utils/api/params';
import { apiUrl } from '@/utils/api/url';
import { headers } from 'next/headers';

type SearchParams = {
	p?: string;
	sortBy?: string;
	name?: string;
	tags?: string;
	mods?: string;
};

const Page: NextAppPage<any, SearchParams> = async ({ searchParams }) => {
	const { page, ...params } = getPageSearchParams(searchParams, {
		take: 20,
		page: 0,
		search: '',
		order: [['asc', 'desc'], 'asc'],
		orderBy: [['totalVotes', 'totalRating', 'downloads', 'mods', 'createdAt', 'updatedAt'], 'createdAt'],
		modded: -1
	});

	const fetchParams = new SearchParamHandler({ ...params, skip: page * params.take });
	const data = await fetch(apiUrl(headers(), 2, `packs`, { ...params, skip: page * params.take })).then((res) => res.json());

	return <></>;
};

export default Page;

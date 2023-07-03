import type { NextAppPage } from '@/types/Next';
import { getPageSearchParams } from '@/utils/api/params';
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
	const data = await fetch(apiUrl(headers(), 2, `blueprints`, { ...params, skip: page * params.take })).then((res) => res.json());

	return <></>;
};

export default Page;

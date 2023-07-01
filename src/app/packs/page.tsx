import { getAppSession } from '@/server/auth';
import type { NextAppPage } from '@/types/Next';

type SearchParams = {
	p?: string;
	sortBy?: string;
	name?: string;
	tags?: string;
	mods?: string;
};

const Page: NextAppPage<any, SearchParams> = async ({ searchParams }) => {
	const { p, sortBy, name, tags, mods } = searchParams;
	const session = await getAppSession();

	return <></>;
};

export default Page;

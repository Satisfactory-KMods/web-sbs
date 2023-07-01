import { getAppSession } from '@/server/auth';
import { prisma } from '@/server/db';
import type { NextAppPage } from '@/types/Next';
import { getServerSession } from 'next-auth';

const Page: NextAppPage<{ userId: string }> = async ({ params }) => {
	const { userId } = params;
	const blueprintPacks = await prisma.blueprintPacks.findMany({ where: { userId } });
	const session = await getAppSession();

	return <></>;
};

export default Page;

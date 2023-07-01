import type { DeepPartial, FlowbiteTheme } from '@/components/Flowbite';
import { Flowbite } from '@/components/Flowbite';
import { NextAuthProvider } from '@/components/NextAuth';
import Foother from '@/components/layout/Foother';
import TopNavbar from '@/components/layout/TopNavbar';
import { getAppSession } from '@/server/auth';
import '@/styles/globals.css';
import { createImageUrl } from '@/utils/Image';
import 'flowbite';
import type { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'KMods: Satisfactory Blueprint Storage',
	description: 'SBS is a web application for sharing Satisfactory blueprints. (Blueprints are stored by SCIM)'
};

const theme: DeepPartial<FlowbiteTheme> = {};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
	const session = await getAppSession();

	return (
		<html lang='en'>
			<head>
				<link rel='shortcut icon' href={createImageUrl({ src: '/logo.webp' })} />
			</head>
			<body className='bg-neutral-100 dark:bg-gray-950'>
				<Flowbite
					theme={{
						dark: false,
						theme
					}}>
					<NextAuthProvider>
						<div className='flex flex-col justify-between'>
							<TopNavbar session={session} />
							<div className='mb-auto flex-1 container mx-auto'>{children}</div>
							<Foother />
						</div>
					</NextAuthProvider>
				</Flowbite>
			</body>
		</html>
	);
}

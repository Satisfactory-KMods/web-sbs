import type { DeepPartial, FlowbiteTheme } from '@/components/Flowbite';
import { Flowbite } from '@/components/Flowbite';
import { NextAuthProvider } from '@/components/NextAuth';
import TopNavbar from '@/components/layout/TopNavbar';
import { getAppSession } from '@/server/auth';
import '@/styles/globals.css';
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
				<link rel='shortcut icon' href='/_next/image?url=/logo.webp&w=32&h=32&q=100' />
			</head>
			<body className='bg-neutral-100 dark:bg-gray-950'>
				<Flowbite
					theme={{
						dark: false,
						theme
					}}>
					<NextAuthProvider>
						<TopNavbar session={session} />
						<div className='flex flex-col justify-between'>
							<div className='mb-auto container mx-auto'>{children}</div>
						</div>
					</NextAuthProvider>
				</Flowbite>
			</body>
		</html>
	);
}

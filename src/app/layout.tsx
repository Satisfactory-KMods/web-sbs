
import type { DeepPartial, FlowbiteTheme } from "@/components/Flowbite";
import { Flowbite } from "@/components/Flowbite";
import { NextAuthProvider } from "@/components/NextAuth";
import { getAppSession } from "@/server/auth";
import "@/styles/globals.css";
import "flowbite";
import type { Metadata } from "next";


export const metadata: Metadata = {
	title: 'KMods: Satisfactory Plus Wiki',
	description: 'Wiki for the mod Satifactory Plus'
};

const theme: DeepPartial<FlowbiteTheme> = {
};

export default async function RootLayout( {
	children
}: {
	children: React.ReactNode
} ) {
	const session = await getAppSession();

	return (
		<html lang="en">
			<head>
				<link rel="shortcut icon" href="/_next/image?url=/logo.webp&w=32&h=32&q=100" />
			</head>
			<body className="bg-neutral-100 dark:bg-gray-950">
				<Flowbite theme={ {
					dark: false,
					theme
				} }>
					<NextAuthProvider>
						<div className="flex flex-col justify-between">
							<div className="mb-auto container mx-auto">
								{ children }
							</div>
						</div>
					</NextAuthProvider>
				</Flowbite>
			</body>
		</html>
	);
}

'use client';
import { Button } from '@/components/Flowbite';
import type { NextAppPage } from '@/types/Next';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { BsHouse } from 'react-icons/bs';
import { FaBoxes, FaGamepad } from 'react-icons/fa';

const take = 5;

const Page: NextAppPage = () => {
	const router = useRouter();

	return (
		<>
			<section>
				<div className='pb-8 px-4 mx-auto max-w-screen-xl lg:pb-16'>
					<div className='py-8 pb-4 px-4 mx-auto max-w-screen-xl text-center lg:py-16 lg:pb-8'>
						<h1 className='mb-8 text-3xl font-extrabold tracking-tight leading-none text-gray-900 md:text-5xl lg:text-5xl dark:text-white'>
							Welcome to{' '}
							<Link prefetch={false} href='https://ficsit.app/mod/SatisfactoryPlus' className='text-blue-600 hover:text-blue-700 hover:underline' target='_blank'>
								Satisfactory Blueprint Storage
							</Link>
						</h1>
						<p className='mb-8 text-lg font-normal text-gray-500 lg:text-xl sm:px-16 lg:px-48 dark:text-gray-400'>SBS is a web application for sharing Satisfactory blueprints. (Blueprints are stored by SCIM)</p>
						<p className='mb-8 text-lg font-normal text-gray-500 lg:text-xl sm:px-16 lg:px-48 dark:text-gray-400'>You can create here Packs. And download all blueprints and packs direktly ingame with our Satisfactory Blueprint Storage Mod.</p>
						<div className='mb-8 text-lg font-normal text-gray-500 lg:text-xl sm:px-16 lg:px-48 dark:text-gray-400'>
							<div className='grid grid-cols-3 gap-2 items-center mx-auto align-middle justify-center'>
								<Button className='flex gap-3 items-center' size='lg' onClick={() => router.push('/blueprints')}>
									<BsHouse className='me-2' /> Blueprints
								</Button>
								<Button className='flex gap-3 items-center' size='lg' onClick={() => router.push('/packs')}>
									<FaBoxes className='me-2' /> Packs
								</Button>
								<Button className='flex gap-3 items-center' size='lg' href='https://ficsit.app/mod/SBS' target='_blank'>
									<FaGamepad className='me-2' /> Mod
								</Button>
							</div>
						</div>
					</div>
				</div>
			</section>
		</>
	);
};

export default Page;

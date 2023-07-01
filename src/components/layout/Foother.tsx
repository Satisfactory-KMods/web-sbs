//@ts-ignore
import { FooterBrand, FooterCopyright, FooterDivider, FooterLink, FooterLinkGroup, FooterMain, FooterTitle } from '@/components/Flowbite';
import Link from 'next/link';
import type { FC } from 'react';
import { BsDiscord, BsGithub } from 'react-icons/bs';
import { SiPatreon } from 'react-icons/si';

import pkg from '@/../package.json';
import { createImageUrl } from '@/utils/Image';

const Foother: FC = () => (
	<FooterMain container className='m-3 container mx-auto'>
		<div className='w-full'>
			<div className='grid w-full justify-between sm:justify-between lg:flex lg:grid-cols-1'>
				<div className='me-3'>
					<FooterBrand alt='KMods Logo' href='#' name='KMods' src={createImageUrl({ src: '/logo.webp' })!} />
					<div className='text-gray-500 py-2 text-sm'>
						The assets comes from Satisfactory or from websites created and owned by Coffee Stain Studios, who hold the copyright of Satisfactory.
						<br />
						All trademarks and registered trademarks present in the image are proprietary to Coffee Stain Studios.
					</div>
				</div>
				<div className='grid gap-8 sm:mt-4 grid-cols-3 md:gap-6'>
					<div>
						<FooterTitle title='about' />
						<FooterLinkGroup col>
							<FooterLink href='https://ficsit.app/user/9uvZtCA4cM6H4q' target='_blank'>
								Our Mods
							</FooterLink>
							<FooterLink href='https://www.patreon.com/kmods' target='_blank'>
								Patreon
							</FooterLink>
						</FooterLinkGroup>
					</div>
					<div>
						<FooterTitle title='Follow us' />
						<FooterLinkGroup col>
							<FooterLink href='https://github.com/Kyri123/sbs' target='_blank'>
								Github
							</FooterLink>
							<FooterLink href='https://discord.gg/ySh7RGJmuV' target='_blank'>
								Discord
							</FooterLink>
						</FooterLinkGroup>
					</div>
					<div>
						<FooterTitle title='Legal' />
						<FooterLinkGroup col>
							<FooterLink href='/policy'>Privacy Policy</FooterLink>
						</FooterLinkGroup>
					</div>
				</div>
			</div>
			<FooterDivider />
			<div className='w-full sm:flex sm:items-center sm:justify-between'>
				<FooterCopyright by='Oliver Kaufmann | KMods' href='#' year={2023} />
				<div className='mt-4 flex space-x-6 sm:mt-0 sm:justify-center'>
					<Link className='text-gray-500 hover:underline hover:text-gray-600' prefetch={false} href={`/changelog/${pkg.version}`}>
						v.{pkg.version}
					</Link>
					<Link className='text-gray-500 hover:underline hover:text-gray-600' prefetch={false} href='https://github.com/Kyri123/sbs' target='_blank'>
						<BsGithub />
					</Link>
					<Link className='text-gray-500 hover:underline hover:text-gray-600' prefetch={false} href='https://discord.gg/ySh7RGJmuV' target='_blank'>
						<BsDiscord />
					</Link>
					<Link className='text-gray-500 hover:underline hover:text-gray-600' prefetch={false} href='https://www.patreon.com/kmods' target='_blank'>
						<SiPatreon />
					</Link>
				</div>
			</div>
		</div>
	</FooterMain>
);

export default Foother;

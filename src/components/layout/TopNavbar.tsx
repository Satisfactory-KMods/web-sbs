import { NavbarBrand, NavbarCollapse, NavbarMain, NavbarToggle } from '@/components/Flowbite';
import SearchField from '@/components/SearchField';
import NavBarAutoLink from '@/components/layout/NavBarAutoLink';
import TopNavbarUserDropdown from '@/components/layout/TopNavbarUserDropdown';
import type { NextAuthSession } from '@/types/Next';
import Image from 'next/image';
import Link from 'next/link';
import type { FunctionComponent } from 'react';

interface TopNavbarProps {
	session: NextAuthSession;
}

const TopNavbar: FunctionComponent<TopNavbarProps> = ({ session }) => (
	<NavbarMain>
		<NavbarBrand href='#'>
			<Image src='/logo.webp' alt='SBS Logo' width={32} height={32} />
			<span className='self-center whitespace-nowrap text-xl font-semibold dark:text-white'>Satisfactory Blueprint Storage</span>
		</NavbarBrand>
		<div className='flex md:order-2'>
			<TopNavbarUserDropdown session={session} />
		</div>
		<NavbarToggle />
		<NavbarCollapse>
			<NavBarAutoLink className='mt-2.5' as={Link} checkSame href='/'>
				Home
			</NavBarAutoLink>
			<NavBarAutoLink className='mt-2.5' as={Link} href='/blueprints'>
				Blueprints
			</NavBarAutoLink>
			<NavBarAutoLink className='mt-2.5' as={Link} href='/packs'>
				Packs
			</NavBarAutoLink>
			<NavBarAutoLink className='mt-2.5' href='https://ficsit.app/mod/SBS' target='_blank'>
				SBS-Mod
			</NavBarAutoLink>
			<SearchField showButton />
		</NavbarCollapse>
	</NavbarMain>
);

export default TopNavbar;

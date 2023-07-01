import { NavbarBrand, NavbarMain } from '@/components/Flowbite';
import TopNavbarUserDropdown from '@/components/layout/TopNavbarUserDropdown';
import type { NextAuthSession } from '@/types/Next';
import Image from 'next/image';
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
	</NavbarMain>
);

export default TopNavbar;

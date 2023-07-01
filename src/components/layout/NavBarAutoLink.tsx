'use client';
import type { NavbarLinkProps } from '@/components/Flowbite';
import { NavbarLink } from '@/components/Flowbite';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { FC } from 'react';

const NavBarAutoLink: FC<NavbarLinkProps & { checkSame?: boolean }> = ({ href, active, as, children, checkSame, ...props }) => {
	const pathname = usePathname();
	return (
		<>
			<NavbarLink as={Link || as} active={checkSame ? href === pathname : !!pathname?.includes(href || '') || active} href={href} {...props}>
				{children}
			</NavbarLink>
		</>
	);
};

export default NavBarAutoLink;

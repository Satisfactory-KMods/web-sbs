'use client';
import { Avatar, DropdownDivider, DropdownHeader, DropdownItem, DropdownMain } from '@/components/Flowbite';
import type { NextAuthSession } from '@/types/Next';
import { createImageUrl } from '@/utils/Image';
import { signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import type { FunctionComponent } from 'react';
import { FaBoxes, FaDoorOpen, FaGithub } from 'react-icons/fa';

interface TopNavbarUserDropdownProps {
	session: NextAuthSession;
}

const TopNavbarUserDropdown: FunctionComponent<TopNavbarUserDropdownProps> = ({ session }) => {
	const router = useRouter();
	const userImage = createImageUrl({ src: session?.user.image });
	return (
		<DropdownMain
			inline
			label={
				<>
					<Avatar img={userImage} rounded />
					{!!session && <span className='hidden md:inline-block ms-2 text-gray-800'>{session.user.name}</span>}
				</>
			}>
			{session ? (
				<>
					<DropdownHeader>
						<span className='block text-sm'>
							Hello, <b>{session.user.name}</b>
						</span>
					</DropdownHeader>
					<DropdownItem onClick={() => router.push(`/user/${session.user.id}`)} className='gap-2'>
						<FaBoxes className='me-2' /> My Blueprint Packs
					</DropdownItem>
					<DropdownDivider />
					<DropdownItem onClick={signOut} className='text-red-700'>
						<FaDoorOpen className='me-2' /> Logout
					</DropdownItem>
				</>
			) : (
				<DropdownItem onClick={() => signIn('discord')}>
					<FaGithub className='me-2' /> Login with Github
				</DropdownItem>
			)}
		</DropdownMain>
	);
};

export default TopNavbarUserDropdown;

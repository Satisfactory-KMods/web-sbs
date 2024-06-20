'use client';

import { Button, TextInput } from '@/components/Flowbite';
import { useRouter, useSearchParams } from 'next/navigation';
import type { FunctionComponent, PropsWithChildren } from 'react';
import { useEffect, useRef } from 'react';
import { BsBoxes, BsHouse } from 'react-icons/bs';
import { HiSearch } from 'react-icons/hi';

interface Props extends PropsWithChildren {
	showButton?: boolean;
}

const SearchField: FunctionComponent<Props> = ({ showButton, children }) => {
	const inputRef = useRef<HTMLInputElement>(null);
	const router = useRouter();
	const searchParams = useSearchParams();

	const oldSearch = searchParams?.get('s') ? encodeURIComponent(searchParams?.get('s')!) : '';

	const onSearch = (e: string) => {
		const input = inputRef.current?.value;
		if (input !== undefined && (oldSearch !== input || !searchParams?.get('s'))) {
			router.push(`/${e}?s=${encodeURIComponent(input)}&p=1`);
		}
	};

	useEffect(() => {
		inputRef.current!.value = oldSearch;
	}, [oldSearch]);

	return (
		<div className='gap-2 flex'>
			<TextInput ref={inputRef} defaultValue={oldSearch} icon={showButton ? undefined : HiSearch} placeholder='Search for an item...' className='flex-1' />
			{showButton && (
				<>
					<Button color='gray' type='button' onClick={() => onSearch('blueprints')}>
						<BsHouse className='text-xl' />
					</Button>
					<Button color='gray' type='button' onClick={() => onSearch('packs')}>
						<BsBoxes className='text-xl' />
					</Button>
				</>
			)}
			{children}
		</div>
	);
};

export default SearchField;

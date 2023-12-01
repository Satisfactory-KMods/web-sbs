import { Pagination } from 'flowbite-react';
import type { FunctionComponent } from 'react';
import { useEffect } from 'react';

interface IPageManagerProps {
	MaxPage: number;
	OnPageChange: (Page: number) => void;
	Page: number;
	Hide?: boolean;
}

const PageManager: FunctionComponent<IPageManagerProps> = ({ MaxPage, Page, OnPageChange, Hide }) => {
	useEffect(() => {
		if (Page > MaxPage || Page < 0) {
			OnPageChange(Math.clamp(0, Page, MaxPage - 1));
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [MaxPage, Page]);

	if (Hide || MaxPage <= 1) {
		return null;
	}

	return (
		<div className='mx-auto mt-3 rounded-lg border border-gray-600 bg-gray-800 p-2 pt-0 text-center'>
			<Pagination
				currentPage={Page}
				layout='pagination'
				onPageChange={OnPageChange}
				showIcons={true}
				totalPages={MaxPage}
				previousLabel='Go back'
				nextLabel='Go forward'
			/>
		</div>
	);
};

export default PageManager;

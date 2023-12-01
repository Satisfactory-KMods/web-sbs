import BlueprintPackRating from '@app/Components/packs/BlueprintPackRating';
import { useBlueprintPack } from '@app/hooks/useBlueprintPack';
import type { BlueprintPackExtended } from '@server/MongoDB/MongoBlueprints';
import { Button } from 'flowbite-react';
import type { FunctionComponent } from 'react';
import { FaEye } from 'react-icons/fa';
import { HiCog, HiDownload, HiTrash } from 'react-icons/hi';
import { Link, useNavigate } from 'react-router-dom';

interface IBlueprintPackRowProps {
	data: BlueprintPackExtended;
	onToggled: () => Promise<void>;
}

const BlueprintPackRow: FunctionComponent<IBlueprintPackRowProps> = ({ data, onToggled }) => {
	const nav = useNavigate();
	const bpHook = useBlueprintPack(data);
	const { blueprintPack, allowedToEdit, remove, image } = bpHook;

	const doRemove = async () => {
		await remove();
		await onToggled();
	};

	return (
		<div className='flex h-20 w-full rounded-lg border border-gray-200 bg-white shadow dark:border-gray-700 dark:bg-gray-800'>
			<img
				className='hidden aspect-video h-full rounded-l-lg object-cover lg:block'
				src={`/api/v1/image/${image[0]}/${image[1]}`}
				alt='BlueprintLogo'
			/>
			<span className='flex-1 p-3 px-5 text-neutral-200'>
				<b className='text-xl'>{blueprintPack.name}</b>
				<span className='block text-sm'>Created at: {new Date(blueprintPack.createdAt).toLocaleString()}</span>
			</span>
			<div className='flex rounded-e-lg border-t border-gray-700 bg-gray-700 p-3'>
				<BlueprintPackRating className='hidden flex-1 px-4 lg:flex' blueprintHook={bpHook} />
				<div className='flex-0 flex items-center px-3 lg:ps-0'>
					{allowedToEdit && (
						<>
							<Button onClick={doRemove} color='red' size='small' className='p-1 px-3'>
								&nbsp;
								<HiTrash /> &nbsp;
							</Button>
							<Link
								to={`/blueprintpacks/edit/${blueprintPack._id}`}
								className='justify-centertext-center group ms-2 flex h-min items-center rounded-lg border border-gray-200 bg-white p-1 px-3 font-medium text-gray-900 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:text-blue-700 focus:ring-2 focus:ring-blue-700 disabled:hover:bg-white dark:border-gray-600 dark:bg-transparent dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:disabled:hover:bg-gray-800'>
								&nbsp;
								<HiCog /> &nbsp;
							</Link>
						</>
					)}

					<Button href={`/api/v1/download/pack/${blueprintPack._id}`} target='_blank' color='gray' size='small' className='ms-2 p-1 px-3'>
						&nbsp;
						<HiDownload />
						&nbsp;
					</Button>

					<Button onClick={() => nav(`/blueprintpacks/show/${blueprintPack._id}`)} color='gray' size='small' className='ms-2 p-1 px-3'>
						&nbsp;&nbsp;
						<FaEye className='me-2 text-sm' />
					</Button>
				</div>
			</div>
		</div>
	);
};

export default BlueprintPackRow;

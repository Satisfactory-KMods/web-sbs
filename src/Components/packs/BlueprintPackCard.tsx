import { mdxComponents } from '@app/Page/terms/private/Page';
import { useBlueprintPack } from '@app/hooks/useBlueprintPack';
import type { BlueprintPackExtended } from '@server/MongoDB/MongoBlueprints';
import { Button } from 'flowbite-react';
import type { FunctionComponent } from 'react';
import { useId } from 'react';
import { HiCog, HiDownload, HiTrash } from 'react-icons/hi';
import { ReactMarkdown } from 'react-markdown/lib/react-markdown';
import { Link } from 'react-router-dom';
import BlueprintRating from './BlueprintPackRating';

interface BlueprintPackCardProps {
	Data: BlueprintPackExtended;
	onToggled: () => Promise<void>;
}

const BlueprintPackCard: FunctionComponent<BlueprintPackCardProps> = ({ Data, onToggled }) => {
	const id = useId();
	const bpHook = useBlueprintPack(Data);
	const { owner, blueprintPack, allowedToEdit, remove, tags, image } = bpHook;

	const doBlacklist = async () => {
		await remove();
		await onToggled();
	};

	return (
		<div className='flex w-full flex-col rounded-lg border border-gray-200 bg-white shadow dark:border-gray-700 dark:bg-gray-800'>
			<Link to={`/blueprintpacks/show/${blueprintPack._id}`} className='flex flex-1 flex-col'>
				<div className='overflow-hidden truncate text-ellipsis rounded-t-lg border-b border-gray-700 bg-gray-700 p-3 text-neutral-200'>
					<span className='text-2xl'>{blueprintPack.name}</span>
					<span className='block text-xs text-gray-400'>Creator: {owner.username}</span>
				</div>
				<div className='relative aspect-video'>
					<div className='absolute inset-0 flex h-full w-full items-center justify-center'>
						<img className='h-full w-full object-cover' src={`/api/v1/image/${image[0]}/${image[1]}`} alt='BlueprintLogo' />
					</div>
					<div className='absolute right-0 top-0 m-3'>
						<div className='rounded-lg border border-orange-700 bg-orange-800 p-1 px-5 text-white'>
							{blueprintPack.mods.length ? 'Modded' : 'Vanilla'}
						</div>
					</div>
				</div>
				<ReactMarkdown components={mdxComponents} className='border-t-1 flex-1 border-gray-700 p-3 text-neutral-200'>
					{`${blueprintPack.description.substring(0, 200)} ...`}
				</ReactMarkdown>
			</Link>
			<div className='flex border-t border-gray-700 bg-gray-700 p-3'>
				<BlueprintRating className='flex-1' blueprintHook={bpHook} />
				<div className='flex-0 flex'>
					{allowedToEdit && (
						<>
							<Button onClick={doBlacklist} color='red' size='small' className='p-1 px-3'>
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
				</div>
			</div>
			{tags.length && (
				<div className='flex flex-wrap rounded-b-lg border-t border-gray-700 bg-gray-700 p-3 pt-0 text-xs text-neutral-200'>
					{tags.map((e) => (
						<div key={id + e._id} className='rounded-lg border border-gray-800 bg-gray-900 p-1 px-3 shadow'>
							{e.DisplayName}
						</div>
					))}
				</div>
			)}
		</div>
	);
};

export default BlueprintPackCard;

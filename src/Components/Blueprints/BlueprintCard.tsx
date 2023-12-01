import { mdxComponents } from '@app/Page/terms/private/Page';
import { useBlueprint } from '@app/hooks/useBlueprint';
import type { BlueprintData } from '@server/MongoDB/MongoBlueprints';
import { Button } from 'flowbite-react';
import type { FunctionComponent } from 'react';
import { useId } from 'react';
import { HiCog, HiDownload, HiTrash } from 'react-icons/hi';
import { ReactMarkdown } from 'react-markdown/lib/react-markdown';
import { Link } from 'react-router-dom';
import BlueprintRating from './BlueprintRating';

interface IBlueprintCardProps {
	Data: BlueprintData;
	onToggled: () => Promise<void>;
}

const BlueprintCard: FunctionComponent<IBlueprintCardProps> = ({ Data, onToggled }) => {
	const id = useId();
	const bpHook = useBlueprint(Data);
	const { owner, Blueprint, allowedToEdit, remove, Tags } = bpHook;

	const doBlacklist = async () => {
		await remove();
		await onToggled();
	};

	return (
		<div className='flex w-full flex-col rounded-lg border border-gray-200 bg-white shadow dark:border-gray-700 dark:bg-gray-800'>
			<Link
				to={
					!Blueprint.SCIMId
						? `/blueprint/${Blueprint._id}`
						: `https://satisfactory-calculator.com/en/blueprints/index/details/id/${Blueprint.SCIMId}`
				}
				target={!Blueprint.SCIMId ? undefined : '_blank'}
				className='flex flex-1 flex-col'>
				<div className='overflow-hidden truncate text-ellipsis rounded-t-lg border-b border-gray-700 bg-gray-700 p-3 text-neutral-200'>
					<span className='text-2xl'>{Blueprint.name}</span>
					<span className='block text-xs text-gray-400'>Creator: {owner.username}</span>
				</div>
				<div className='relative aspect-video'>
					<div className='absolute inset-0 flex h-full w-full items-center justify-center'>
						<img
							className='h-full w-full object-cover'
							src={`/api/v1/image/${Blueprint._id}/${Blueprint.images[0]}`}
							alt='BlueprintLogo'
						/>
					</div>
					<div className='absolute right-0 top-0 m-3'>
						<div className='rounded-lg border border-orange-700 bg-orange-800 p-1 px-5 text-white'>
							{Blueprint.mods.length ? 'Modded' : 'Vanilla'}
						</div>
					</div>
				</div>
				<ReactMarkdown components={mdxComponents} className='border-t-1 flex-1 border-gray-700 p-3 text-neutral-200'>
					{`${Blueprint.description.substring(0, 200)} ...`}
				</ReactMarkdown>
			</Link>
			<div className='flex border-t border-gray-700 bg-gray-700 p-3'>
				<BlueprintRating className='flex-1' blueprintHook={bpHook} />
				<div className='flex-0 flex'>
					{allowedToEdit && !Blueprint.SCIMId && (
						<>
							<Button onClick={doBlacklist} color='red' size='small' className='p-1 px-3'>
								&nbsp;
								<HiTrash /> &nbsp;
							</Button>
							<Link
								to={`/blueprint/edit/${Blueprint._id}`}
								className='justify-centertext-center group ms-2 flex h-min items-center rounded-lg border border-gray-200 bg-white p-1 px-3 font-medium text-gray-900 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:text-blue-700 focus:ring-2 focus:ring-blue-700 disabled:hover:bg-white dark:border-gray-600 dark:bg-transparent dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:disabled:hover:bg-gray-800'>
								&nbsp;
								<HiCog /> &nbsp;
							</Link>
						</>
					)}

					<Button href={`/api/v1/download/${Blueprint._id}`} target='_blank' color='gray' size='small' className='ms-2 p-1 px-3'>
						<HiDownload className='me-2 text-sm' /> {Blueprint.downloads}
					</Button>
				</div>
			</div>
			{!!Blueprint.tags.length && (
				<div className='flex flex-wrap rounded-b-lg border-t border-gray-700 bg-gray-700 p-3 pt-0 text-xs text-neutral-200'>
					{Tags.map((e) => (
						<div key={id + e._id} className='rounded-lg border border-gray-800 bg-gray-900 p-1 px-3 shadow'>
							{e.DisplayName}
						</div>
					))}
				</div>
			)}
		</div>
	);
};

export default BlueprintCard;

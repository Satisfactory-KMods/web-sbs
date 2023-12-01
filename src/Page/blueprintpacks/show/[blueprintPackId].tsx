import BlueprintPackBlueprintRow from '@app/Components/packs/BlueprintPackBlueprintRow';
import BlueprintPackRating from '@app/Components/packs/BlueprintPackRating';
import type { BlueprintPackDefaultLoader } from '@app/Lib/loaderHelper';
import { mdxComponents } from '@app/Page/terms/private/Page';
import { useBlueprintPack } from '@app/hooks/useBlueprintPack';
import { Button } from 'flowbite-react';
import type { FunctionComponent } from 'react';
import { useId } from 'react';
import { BiUser, BiWrench } from 'react-icons/bi';
import { BsHouseAdd } from 'react-icons/bs';
import { FaClock } from 'react-icons/fa';
import { HiCog, HiDownload, HiTrash } from 'react-icons/hi';
import ReactMarkdown from 'react-markdown';
import { Link, useLoaderData, useNavigate } from 'react-router-dom';

const Component: FunctionComponent = () => {
	const nav = useNavigate();
	const id = useId();
	const loaderData = useLoaderData() as BlueprintPackDefaultLoader;
	const bpHook = useBlueprintPack(loaderData.blueprintPack);
	const { mods, tags, owner, blueprintPack, blueprints, image, allowedToEdit, remove } = bpHook;

	const doRemove = async () => {
		await remove();
		nav('/blueprintpacks/list');
	};

	return (
		<>
			<div className='grid grid-cols-1 gap-3 xl:grid-cols-5'>
				<div className='flex w-full flex-col rounded-lg border border-gray-200 bg-white shadow dark:border-gray-700 dark:bg-gray-800 xl:col-span-3'>
					<div className='overflow-hidden truncate text-ellipsis rounded-t-lg border-b border-gray-700 bg-gray-700 p-3 text-neutral-200'>
						<span className='text-2xl'>{blueprintPack.name}</span>
						<span className='block text-xs text-gray-400'>Creator: {owner.username}</span>
					</div>
					<div className='relative h-56 sm:h-64 xl:h-80 2xl:h-96'>
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
						{blueprintPack.description}
					</ReactMarkdown>
					<div className=' flex border-t border-gray-700 bg-gray-700 p-3'>
						<BlueprintPackRating className='flex-1' blueprintHook={bpHook} />
					</div>
					{!!tags.length && (
						<div className='flex flex-wrap rounded-b-lg border-t border-gray-700 bg-gray-700 p-3 pt-0 text-xs text-neutral-200'>
							{tags.map((e) => (
								<div key={id + e._id} className='rounded-lg border border-gray-800 bg-gray-900 p-1 px-3 shadow'>
									{e.DisplayName}
								</div>
							))}
						</div>
					)}
				</div>

				<div className='flex w-full flex-col rounded-lg border border-gray-200 bg-white shadow dark:border-gray-700 dark:bg-gray-800 xl:col-span-2'>
					<div className='mb-auto flex flex-1 flex-col'>
						<div className='rounded-t-lg border-b border-gray-700 bg-gray-900 p-3 text-neutral-300'>
							<BiUser className='me-1 inline pb-1 text-xl' /> <b>Creator:</b> {owner.username}
						</div>
						<div className='border-b border-gray-700 bg-gray-900 p-3 text-neutral-300'>
							<BsHouseAdd className='me-1 inline pb-1 text-xl' /> <b>Blueprints:</b>{' '}
							<span className='text-neutral-100'>{blueprints.length}</span>
						</div>
						<div className='border-b border-gray-700 bg-gray-900 p-3 text-neutral-300'>
							<FaClock className='me-1 inline pb-1 text-xl' /> <b>Created at:</b>{' '}
							<span className='text-neutral-100'>{new Date(blueprintPack.createdAt).toLocaleString()}</span>
						</div>
						<div className='border-b border-gray-700 bg-gray-900 p-3 text-neutral-300'>
							<FaClock className='me-1 inline pb-1 text-xl' /> <b>Last Update:</b>{' '}
							<span className='text-neutral-100'>{new Date(blueprintPack.updatedAt).toLocaleString()}</span>
						</div>
						{!!mods.length && (
							<div className='border-b border-gray-700 bg-gray-900 p-3 text-neutral-300'>
								<BiWrench className='me-1 inline pb-1 text-xl' /> <b>Used Mods:</b>
								{mods.map((e) => (
									<Link
										to={`https://ficsit.app/mod/${e.id}`}
										target='_blank'
										key={id + e.id}
										className='mt-2 flex rounded-lg border border-gray-700 bg-gray-600 p-0 shadow hover:bg-gray-700'>
										<img
											onError={(e) => {
												e.currentTarget.src = '/images/default/unknown.png';
											}}
											src={e.logo}
											alt={e.name}
											className='h-8 w-8 rounded-l-lg'
										/>
										<span className='px-2 py-1'>{e.name}</span>
									</Link>
								))}
							</div>
						)}
					</div>

					<div className='flex-0 flex border-t border-gray-800 bg-gray-700 p-3'>
						{allowedToEdit && (
							<>
								<Button onClick={doRemove} color='red' size='small' className='p-1 px-3'>
									<HiTrash className='me-2 text-sm' /> Delete
								</Button>
								<Link
									to={`/blueprintpacks/edit/${blueprintPack._id}`}
									className='justify-centertext-center group ms-2 flex h-min items-center rounded-lg border border-gray-200 bg-white p-1 px-3 font-medium text-gray-900 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:text-blue-700 focus:ring-2 focus:ring-blue-700 disabled:hover:bg-white dark:border-gray-600 dark:bg-transparent dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:disabled:hover:bg-gray-800'>
									<HiCog className='me-2 text-sm' /> Edit Blueprint
								</Link>
							</>
						)}

						<Button
							href={`/api/v1/download/pack/${blueprintPack._id}`}
							target='_blank'
							color='gray'
							size='small'
							className='ms-2 p-1 px-3'>
							&nbsp;
							<HiDownload />
							&nbsp;
						</Button>
					</div>
				</div>
			</div>

			<div className='mt-3 flex flex-col gap-3'>
				<div className='overflow-hidden truncate text-ellipsis rounded-lg border-b border-gray-700 bg-gray-700 p-3 text-neutral-200'>
					<span className='text-2xl'>Blueprints</span>
				</div>
				{blueprints.map((e) => (
					<BlueprintPackBlueprintRow
						onToggled={async () => {
							nav(0);
						}}
						Data={e}
						key={e._id}
					/>
				))}
			</div>
		</>
	);
};

export { Component };

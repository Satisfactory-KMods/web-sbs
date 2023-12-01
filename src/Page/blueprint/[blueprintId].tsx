import BlueprintRating from '@app/Components/Blueprints/BlueprintRating';
import { CopyButton } from '@app/Components/elements/Buttons';
import type { BlueprintIdLoader } from '@app/Page/blueprint/edit/[blueprintId]Loader';
import { mdxComponents } from '@app/Page/terms/private/Page';
import { useAuth } from '@app/hooks/useAuth';
import type { SaveComponent, SaveEntity } from '@etothepii/satisfactory-file-parser';
import { useBlueprint } from '@hooks/useBlueprint';
import { Button, Carousel } from 'flowbite-react';
import type { FunctionComponent } from 'react';
import { useId, useMemo } from 'react';
import { BiUser, BiWrench } from 'react-icons/bi';
import { BsArrowLeft, BsBox, BsBoxes, BsHouseAdd } from 'react-icons/bs';
import { FaClock, FaPlus } from 'react-icons/fa';
import { HiCog, HiDownload, HiTrash } from 'react-icons/hi';
import { MdOutlinePhotoSizeSelectSmall } from 'react-icons/md';
import ReactMarkdown from 'react-markdown';
import { Link, useLoaderData, useNavigate } from 'react-router-dom';

const Component: FunctionComponent = () => {
	const nav = useNavigate();
	const id = useId();
	const { loggedIn } = useAuth();
	const { blueprintData, blueprintOwner, blueprint } = useLoaderData() as BlueprintIdLoader;
	const bpHook = useBlueprint(blueprintData, blueprintOwner, { blueprint });
	const { owner, Blueprint, blueprintParse, allowedToEdit, remove, Tags, Mods } = bpHook;

	const doBlacklist = async () => {
		await remove();
		nav('/blueprintpacks/list');
	};

	const buildingCount = useMemo(() => {
		const objects: (SaveEntity | SaveComponent)[] = blueprintParse?.objects || [];
		return objects.filter((e) => e.type === 'SaveEntity').length;
	}, [blueprintParse?.objects]);

	const totalItemCost = useMemo(() => {
		const itemCosts: [string, number][] = blueprintParse?.header.itemCosts || [];
		return itemCosts.reduce((total, cost) => total + cost[1], 0);
	}, [blueprintParse?.header.itemCosts]);

	if (Blueprint.SCIMId || 0 > 1) {
		window.location.href = `https://satisfactory-calculator.com/en/blueprints/index/details/id/${Blueprint.SCIMId}`;
	}

	return (
		<div className='grid grid-cols-1 gap-3 xl:grid-cols-5'>
			<div className='flex w-full flex-col rounded-lg border border-gray-200 bg-white shadow dark:border-gray-700 dark:bg-gray-800 xl:col-span-3'>
				<div className='flex overflow-hidden truncate text-ellipsis rounded-t-lg border-b border-gray-700 bg-gray-700 p-3 text-neutral-200'>
					<div className='flex-1'>
						<span className='text-2xl'>{Blueprint.name}</span>
						<span className='block text-xs text-gray-400'>
							Creator: <b>{owner.username}</b>
						</span>
					</div>
					<Button size='xs' color='green' onClick={() => nav('/blueprint/list')} className='me-2'>
						<BsArrowLeft className='me-2' /> Back
					</Button>
					{loggedIn && (
						<Button size='xs' color='green' onClick={() => nav('/blueprint/create')}>
							<FaPlus className='me-2' /> Add new
						</Button>
					)}
				</div>
				<div className='relative h-56 sm:h-64 xl:h-80 2xl:h-96'>
					<div className='absolute inset-0 flex h-full w-full items-center justify-center'>
						{Blueprint.images.length > 1 ? (
							<Carousel>
								{Blueprint.images.map((e) => (
									<img
										className='h-full w-full object-cover'
										src={`/api/v1/image/${Blueprint._id}/${e}`}
										key={id + e}
										alt='BlueprintLogo'
									/>
								))}
							</Carousel>
						) : (
							<img
								className='h-full w-full object-cover'
								src={`/api/v1/image/${Blueprint._id}/${Blueprint.images[0]}`}
								alt='BlueprintLogo'
							/>
						)}
					</div>
					<div className='absolute right-0 top-0 m-3'>
						<div className='rounded-lg border border-orange-700 bg-orange-800 p-1 px-5 text-white'>
							{Blueprint.mods.length ? 'Modded' : 'Vanilla'}
						</div>
					</div>
				</div>
				<ReactMarkdown components={mdxComponents} className='border-t-1 flex-1 border-gray-700 p-3 text-neutral-200'>
					{Blueprint.description}
				</ReactMarkdown>
				<div className=' flex border-t border-gray-700 bg-gray-700 p-3'>
					<BlueprintRating className='flex-1' blueprintHook={bpHook} />
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

			<div className='flex w-full flex-col rounded-lg border border-gray-200 bg-white shadow dark:border-gray-700 dark:bg-gray-800 xl:col-span-2'>
				<div className='mb-auto flex flex-1 flex-col'>
					<div className='rounded-t-lg border-b border-gray-700 bg-gray-900 p-3 text-neutral-300'>
						<BiUser className='me-1 inline pb-1 text-xl' /> <b>Creator:</b> {owner.username}
					</div>
					<div className='flex rounded-t-lg border-b border-gray-700 bg-gray-900 p-3 text-neutral-300'>
						<div className='flex-1'>
							<BiUser className='content-left me-1 inline pb-1 text-xl' />
							<b>Blueprint ID:</b> <span className='text-neutral-100'>{Blueprint._id}</span>
						</div>
						<CopyButton size='xs' copyString={Blueprint._id} />
					</div>
					<div className='border-b border-gray-700 bg-gray-900 p-3 text-neutral-300'>
						<MdOutlinePhotoSizeSelectSmall className='me-1 inline pb-1 text-xl' /> <b>Designer Size:</b>
						<span className='text-neutral-100'>{Blueprint.DesignerSize}</span>
					</div>
					<div className='border-b border-gray-700 bg-gray-900 p-3 text-neutral-300'>
						<BsHouseAdd className='me-1 inline pb-1 text-xl' /> <b>Buildings:</b>{' '}
						<span className='text-neutral-100'>{buildingCount}</span>
					</div>
					<div className='border-b border-gray-700 bg-gray-900 p-3 text-neutral-300'>
						<BsBox className='me-1 inline pb-1 text-xl' /> <b>Object-Count:</b>{' '}
						<span className='text-neutral-100'>{blueprintParse?.objects.length || 0}</span>
					</div>
					<div className='border-b border-gray-700 bg-gray-900 p-3 text-neutral-300'>
						<BsBoxes className='me-1 inline pb-1 text-xl' /> <b>Total Cost:</b>{' '}
						<span className='text-neutral-100'>{totalItemCost} items</span>
					</div>
					<div className='border-b border-gray-700 bg-gray-900 p-3 text-neutral-300'>
						<HiDownload className='me-1 inline pb-1 text-xl' /> <b>Total Downloads:</b>{' '}
						<span className='text-neutral-100'>{Blueprint.downloads}</span>
					</div>
					<div className='border-b border-gray-700 bg-gray-900 p-3 text-neutral-300'>
						<FaClock className='me-1 inline pb-1 text-xl' /> <b>Created at:</b>{' '}
						<span className='text-neutral-100'>{new Date(Blueprint.createdAt).toLocaleString()}</span>
					</div>
					<div className='border-b border-gray-700 bg-gray-900 p-3 text-neutral-300'>
						<FaClock className='me-1 inline pb-1 text-xl' /> <b>Last Update:</b>{' '}
						<span className='text-neutral-100'>{new Date(Blueprint.updatedAt).toLocaleString()}</span>
					</div>
					{!!Mods.length && (
						<div className='border-b border-gray-700 bg-gray-900 p-3 text-neutral-300'>
							<BiWrench className='me-1 inline pb-1 text-xl' /> <b>Used Mods:</b>
							{Mods.map((e) => (
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
							<Button onClick={doBlacklist} color='red' size='small' className='p-1 px-3'>
								<HiTrash className='me-2 text-sm' /> Delete
							</Button>
							<Link
								to={`/blueprint/edit/${Blueprint._id}`}
								className='justify-centertext-center group ms-2 flex h-min items-center rounded-lg border border-gray-200 bg-white p-1 px-3 font-medium text-gray-900 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:text-blue-700 focus:ring-2 focus:ring-blue-700 disabled:hover:bg-white dark:border-gray-600 dark:bg-transparent dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:disabled:hover:bg-gray-800'>
								<HiCog className='me-2 text-sm' /> Edit Blueprint
							</Link>
						</>
					)}

					<Button href={`/api/v1/download/${Blueprint._id}`} target='_blank' color='gray' size='small' className='ms-2 p-1 px-3'>
						<HiDownload className='me-2 text-sm' /> Download ({Blueprint.downloads})
					</Button>
				</div>
			</div>
		</div>
	);
};

export { Component };

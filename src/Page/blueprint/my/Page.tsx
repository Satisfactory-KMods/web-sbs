import BlueprintFilter from '@app/Components/Blueprints/BlueprintFilter';
import BlueprintRow from '@app/Components/Blueprints/BlueprintRow';
import PageManager from '@app/Components/Main/PageManager';
import { CopyButton, LoadingButton } from '@app/Components/elements/Buttons';
import { SBSInput } from '@app/Components/elements/Inputs';
import { apiQueryLib } from '@app/Lib/Api/API_Query.Lib';
import { successSwalAwait, tRPCAuth, tRPCHandleError } from '@app/Lib/tRPC';
import type { IndexLoaderData } from '@app/Page/blueprint/list/Loader';
import { EApiBlueprintUtils } from '@app/Shared/Enum/EApiPath';
import { useAuth } from '@app/hooks/useAuth';
import { useRawPageHandler } from '@app/hooks/useRawPageHandler';
import { usePageTitle, useToggle } from '@kyri123/k-reactutils';
import type { BlueprintData } from '@server/MongoDB/MongoBlueprints';
import type { FilterSchema } from '@server/trpc/routings/public/blueprint';
import { Button, Modal } from 'flowbite-react';
import type { ChangeEventHandler, FunctionComponent } from 'react';
import { useState } from 'react';
import { BiUpload } from 'react-icons/bi';
import { FaPlus } from 'react-icons/fa';
import { useLoaderData, useNavigate } from 'react-router-dom';

const Component: FunctionComponent = () => {
	usePageTitle(`SBS - My Blueprints`);
	const nav = useNavigate();
	const { loggedIn } = useAuth();
	const { blueprints, totalBlueprints } = useLoaderData() as IndexLoaderData;
	const [showBulk, toggleShowBulk] = useToggle(false);

	const [TotalBlueprints, setTotalBlueprints] = useState<number>(() => totalBlueprints);
	const [Blueprints, setBlueprints] = useState<BlueprintData[]>(() => blueprints);

	const [filter, setFilter] = useState<FilterSchema>({});
	const [isFetching, setIsFetching] = useState<boolean>(false);
	const onPageChange: Parameters<typeof useRawPageHandler>[1] = async (options) => {
		setIsFetching(true);
		const queryFilter = { filterOptions: filter, ...options };
		const Blueprints = await tRPCAuth.blueprints.myBlueprints.query(queryFilter).catch(tRPCHandleError);
		if (Blueprints) {
			setBlueprints(Blueprints.blueprints);
			setTotalBlueprints(Blueprints.totalBlueprints);
		}
		setIsFetching(false);
	};
	const { setPage, currentPage, maxPage, filterOption } = useRawPageHandler(TotalBlueprints, onPageChange, 20);
	const doFetch = async () => onPageChange(filterOption);

	const [sbpFiles, setSbpFiles] = useState<FileList | null>(() => null);
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const handleFileSelect: ChangeEventHandler<HTMLInputElement> = (e) => {
		setSbpFiles(e.target.files);
	};

	const bulkUpload = async () => {
		if (sbpFiles) {
			setIsLoading(true);
			const formData = new FormData();
			for (let i = 0; i < sbpFiles.length; i++) {
				formData.append('blueprints', sbpFiles[i]);
			}
			await apiQueryLib
				.PostToAPI<{
					message: string;
				}>(EApiBlueprintUtils.bulkUpdate, formData)
				.then(async (response) => {
					await successSwalAwait(response.message);
					toggleShowBulk();
				})
				.catch(() => {});
			setIsLoading(false);
		}
	};

	return (
		<>
			<div className='flex flex-col'>
				<BlueprintFilter filterSchema={[filter, setFilter]} isFetching={isFetching} doFetch={doFetch}>
					<span className='flex-1'>Blueprint Filter ({TotalBlueprints})</span>
					{loggedIn && (
						<Button size='xs' color='green' onClick={toggleShowBulk}>
							<FaPlus className='me-2' /> Bulk Upload
						</Button>
					)}
				</BlueprintFilter>
				<PageManager MaxPage={maxPage} Page={currentPage} OnPageChange={setPage} />

				<div className='mt-2 flex flex-col gap-2'>
					{Blueprints.map((BP) => (
						<BlueprintRow key={BP._id} Data={BP} onToggled={doFetch} />
					))}
				</div>

				<PageManager Hide={maxPage === currentPage} MaxPage={maxPage} Page={currentPage} OnPageChange={setPage} />
			</div>

			{showBulk && (
				<Modal dismissible={true} className='dark' show={showBulk} size='5xl' onClose={toggleShowBulk}>
					<Modal.Header>Bulk update blueprints</Modal.Header>
					<Modal.Body>
						<SBSInput
							accept='.sbpcfg,.sbp'
							multiple
							hintClassName='flex'
							hint={
								<>
									<span className='flex-1 self-center text-sm'>
										Blueprint files can you find here: <b>%localappdata%\FactoryGame\Saved\SaveGames\blueprints</b>
									</span>
									<CopyButton size='xs' copyString='%localappdata%\FactoryGame\Saved\SaveGames\blueprints' />
								</>
							}
							name='sbpcfg'
							required={true}
							label='Blueprints (.sbpcfg|.sbp)'
							type='file'
							onChange={handleFileSelect}
						/>
					</Modal.Body>
					<Modal.Footer>
						<LoadingButton disabled={!sbpFiles || sbpFiles.length <= 1} Icon={BiUpload} isLoading={isLoading} onClick={bulkUpload}>
							Upload
						</LoadingButton>
						<Button color='gray' onClick={toggleShowBulk}>
							Cancel
						</Button>
					</Modal.Footer>
				</Modal>
			)}
		</>
	);
};

export { Component };

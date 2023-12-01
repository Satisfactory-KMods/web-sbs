import BlueprintCard from '@app/Components/Blueprints/BlueprintCard';
import BlueprintFilter from '@app/Components/Blueprints/BlueprintFilter';
import PageManager from '@app/Components/Main/PageManager';
import { useAuth } from '@app/hooks/useAuth';
import { tRPCHandleError, tRPCPublic } from '@applib/tRPC';
import { useRawPageHandler } from '@hooks/useRawPageHandler';
import { usePageTitle } from '@kyri123/k-reactutils';
import type { IndexLoaderData } from '@page/blueprint/list/Loader';
import type { BlueprintData } from '@server/MongoDB/MongoBlueprints';
import type { FilterSchema } from '@server/trpc/routings/public/blueprint';
import type { FunctionComponent } from 'react';
import { useState } from 'react';
import { useLoaderData, useNavigate } from 'react-router-dom';

const Component: FunctionComponent = () => {
	const { loggedIn } = useAuth();
	const { blueprints, totalBlueprints } = useLoaderData() as IndexLoaderData;
	const nav = useNavigate();

	const [TotalBlueprints, setTotalBlueprints] = useState<number>(() => totalBlueprints);
	const [Blueprints, setBlueprints] = useState<BlueprintData[]>(() => blueprints);

	usePageTitle(`SBS - Blueprints`);

	const [filter, setFilter] = useState<FilterSchema>({});
	const [isFetching, setIsFetching] = useState<boolean>(false);
	const onPageChange: Parameters<typeof useRawPageHandler>[1] = async (options) => {
		setIsFetching(true);
		const queryFilter = { filterOptions: filter, ...options };
		const Blueprints = await tRPCPublic.blueprint.getBlueprints.query(queryFilter).catch(tRPCHandleError);
		if (Blueprints) {
			setBlueprints(Blueprints.blueprints);
			setTotalBlueprints(Blueprints.totalBlueprints);
		}
		setIsFetching(false);
	};
	const { setPage, currentPage, maxPage, filterOption } = useRawPageHandler(TotalBlueprints, onPageChange, 12);
	const doFetch = async () => onPageChange(filterOption);

	return (
		<>
			<BlueprintFilter hideTags filterSchema={[filter, setFilter]} isFetching={isFetching} doFetch={doFetch}>
				<span className='flex-1'>Blueprint Filter ({TotalBlueprints})</span>
			</BlueprintFilter>
			<PageManager MaxPage={maxPage} Page={currentPage} OnPageChange={setPage} />

			<div className='mt-3 grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3'>
				{Blueprints.map((BP) => (
					<BlueprintCard key={BP._id} Data={BP} onToggled={doFetch} />
				))}
			</div>

			<PageManager Hide={maxPage === currentPage} MaxPage={maxPage} Page={currentPage} OnPageChange={setPage} />
		</>
	);
};

export { Component };

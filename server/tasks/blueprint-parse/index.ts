import chunk from 'lodash/chunk';
import { schedule } from 'node-cron';
import { log } from '~/utils/logger';
import { BlueprintParser } from '~~/server/utils/blueprintParser';
import {
	calculatorBlueprintPage,
	calculatorPages,
	downloadBlueprint,
	parseInformationFromBlueprintConfig
} from './utils';

async function handler() {
	log('info', 'Running Task');

	const blacklist = new Set([3142, 2635]);
	const blueprintPages = new Set<string>();

	// Fetch all blueprint pages
	let page = 1;
	while (page < 2) {
		const fetchPageUrl = `https://satisfactory-calculator.com/de/blueprints/index/index/p/${page}`;
		log('tasks', `Fetching page ${page}`, fetchPageUrl);

		const pageContent = await calculatorPages
			.get(String(page))
			.then((r) => r.data)
			.then((r) => {
				return Array.from(r.matchAll(/<a\s+(?:[^>]*?\s+)?href=(["'])(.*?)\1/g))
					.map((e: any) => e[2]! as string)
					.filter((e: any) => !!e.match(/\/blueprints\/index\/details\/id/));
			})
			.catch((e) => {
				log('error', 'Error fetching page', e.message);
				return [] as string[];
			});

		if (pageContent.length === 0) {
			break;
		}

		pageContent.forEach(async (path) => {
			blueprintPages.add(path);
		});

		if (pageContent.length < 20) {
			break;
		}
		page++;
	}

	const asArr = Array.from(blueprintPages);
	log('tasks', `found in total ${asArr.length} blueprints`);
	const chunks = chunk(asArr, asArr.length / 5);

	let count = 0;
	await Promise.all(
		chunks.map(async (chunk) => {
			for (const path of chunk) {
				const blueprintName = path.split('/').pop();
				const blueprintId = Number(path.split('/').slice(-3)[0]);

				if (blacklist.has(blueprintId)) {
					log('tasks', `Skipping blacklisted blueprint ${blueprintId}`);
					continue;
				}

				if (!blueprintName || Number.isNaN(blueprintId)) {
					log('error', 'Invalid blueprint path:', path);
					continue;
				}

				const blueprintPage = await calculatorBlueprintPage
					.get(path)
					.then((r) => parseInformationFromBlueprintConfig(r.data))
					.catch((e) => {
						log('error', 'Error fetching blueprint page', e.message);
						return null;
					});

				if (!blueprintPage) {
					continue;
				}

				const { foundImageUrls, categories, scimUser } = blueprintPage;

				const { folder, remove: cancelBlueprint } = await downloadBlueprint(
					blueprintId,
					blueprintName
				);

				const reader = await BlueprintParser.create(folder, blueprintName);

				if (!reader) {
					await cancelBlueprint();
					continue;
				}

				log(
					'tasks',
					`Downloaded ${++count}/${asArr.length} blueprints`,
					blueprintId,
					blueprintName,
					{ foundImageUrls, categories, scimUser }
				);
			}
		})
	);

	log('tasks', `Finished Task successfully downloaded ${count} blueprints`);
}

/**
 *  Install the task
 *  to request all blueprints from the SCIM server
 *  so we can save them in the database to use them faster
 *  in the mod SBS
 * */
export default function (cron: string, runOnInit: boolean) {
	// Delay init run and install by 2 seconds
	setTimeout(() => {
		log('info', 'Scheduled Task installed:', 'SCIM');

		// install the task
		schedule(cron, handler, {
			runOnInit
		});
	}, 2000);
}

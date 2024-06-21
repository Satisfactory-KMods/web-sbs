import { eq } from '@kmods/drizzle-pg';
import chunk from 'lodash/chunk';
import { schedule } from 'node-cron';
import { z } from 'zod';
import { log } from '~/utils/logger';
import { env } from '~~/env';
import { BlueprintParser } from '~~/server/utils/blueprintParser';
import { db } from '~~/server/utils/db/postgres/pg';
import {
	BlueprintInsert,
	scBlueprint,
	scBlueprintMods,
	scBlueprintTags,
	zodIconData
} from '~~/server/utils/db/postgres/schema';
import { getOrCreateTags } from '~~/server/utils/db/query/tags';
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
	while (page < 200_000) {
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
				log('tasks-error', 'Error fetching page', e.message);
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
	const chunks = chunk(asArr, Math.ceil(asArr.length / 2));

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
					count++;
					log(
						'tasks-error',
						`(${count}/${asArr.length})`,
						'Invalid blueprint path:',
						path
					);
					continue;
				}

				const blueprintPage = await calculatorBlueprintPage
					.get(path)
					.then((r) => parseInformationFromBlueprintConfig(r.data))
					.catch((e) => {
						log('tasks-error', 'Error fetching blueprint page', e.message);
						return null;
					});

				if (!blueprintPage) {
					continue;
				}

				const { foundImageUrls, categories, scimUser } = blueprintPage;

				const {
					folder,
					remove: cancelBlueprint,
					zipSize
				} = await downloadBlueprint(blueprintId, blueprintName);

				const reader = await BlueprintParser.create(folder, blueprintName);

				if (!reader) {
					count++;
					log(
						'tasks-error',
						`Error downloading blueprint (${count}/${asArr.length})`,
						blueprintId,
						blueprintName
					);
					await cancelBlueprint();
					continue;
				}

				const blueprintMods = reader.getMods();
				const blueprint = reader.blueprintData;

				const description = blueprint.config.description;
				const iconData: z.input<typeof zodIconData> = {
					iconID: blueprint.config.iconID,
					color: blueprint.config.color
				};

				const blueprintInsert: BlueprintInsert = {
					id: blueprintId,
					name: blueprintName,
					raw_name: decodeURIComponent(blueprintName).replace(/(\_|\+|(\%+d))/g, ' '),
					images: foundImageUrls,
					size: zipSize,
					description,
					isModded: !!blueprintMods.length,
					download: 0,
					iconData,
					scimUser: scimUser
				};

				await db
					.transaction(async (trx) => {
						const { download, ...set } = blueprintInsert;

						await trx
							.insert(scBlueprint)
							.values(blueprintInsert)
							.onConflictDoUpdate({
								target: [scBlueprint.id],
								set
							});

						await trx
							.delete(scBlueprintMods)
							.where(eq(scBlueprintMods.id, blueprintId));

						if (blueprintMods.length) {
							await trx
								.insert(scBlueprintMods)
								.values(
									blueprintMods.map((mod) => ({ id: blueprintId, mod_ref: mod }))
								)
								.onConflictDoNothing();
						}

						if (!!categories.length) {
							const tags = await getOrCreateTags(categories, trx);

							await trx
								.delete(scBlueprintTags)
								.where(eq(scBlueprintTags.id, blueprintId));
							await trx
								.insert(scBlueprintTags)
								.values(tags.map(({ tag_id }) => ({ id: blueprintId, tag_id })))
								.onConflictDoNothing();
						}
					})
					.then(() => {
						count++;
						log(
							'tasks',
							`Inserted blueprint (${count}/${asArr.length})`,
							blueprintId,
							blueprintName
						);
					})
					.catch(async (e) => {
						count++;
						log(
							'tasks-error',
							`Error inserting blueprint (${count}/${asArr.length})`,
							e.message,
							blueprintId,
							blueprintName
						);
						await cancelBlueprint();
					});
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
	if (!!env.tasks.disableScim) {
		log('tasks-warn', 'Scheduled Task disabled:', 'SCIM', cron);
		return;
	}

	log('tasks', 'Scheduled Task installed:', 'SCIM', cron);

	// install the task
	schedule(cron, handler, {
		runOnInit
	});
}

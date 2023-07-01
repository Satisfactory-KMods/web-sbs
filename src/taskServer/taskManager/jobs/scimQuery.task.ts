/* eslint-disable import/no-anonymous-default-export */
import { prisma } from '@/server/db';
import { JobTask } from '@/taskServer/taskManager/TaskManager';
import { Blueprint, createNewBlueprint } from '@/utils/Blueprint';
import { BlueprintReader } from '@/utils/BlueprintReader';
import { kbotApi } from '@/utils/KBotApi';
import { mountHandler } from '@/utils/MoundHandler';
import { DesignerSize } from '@/utils/enum/DesignerSize';
import { copyFileSync, existsSync, mkdirSync, readFileSync, renameSync, rmSync } from 'fs';
import { writeFile } from 'fs/promises';
import Jimp from 'jimp';
import type { RequestInit } from 'node-fetch';
import fetch from 'node-fetch';
import path, { join } from 'path';

const time = (3600000 * 24) / 6;

export default new JobTask(time, 'SCIM Query', async () => {
	console.info('tasks', 'Running Task', 'SCIM');
	let user = await prisma.user.findFirst({ where: { name: 'Satisfactory - Calculator' } })!;
	if (!user) {
		user = await prisma.user.create({
			data: {
				name: 'Satisfactory - Calculator',
				email: 'none@none.de',
				apiKey: Math.random().toString()
			}
		});
	}

	if (!user) {
		console.info('tasks', 'Cancel SCIM Task');
		return;
	}

	const mods = new Set<string>();
	const allCategories = new Set<string>();
	const calledIds = new Set<string>();
	const blacklist = new Set<string>(['3142', '2635']);
	outLoop: for (let page = 1; page < 10000; page++) {
		const fetchPageUrl = `https://satisfactory-calculator.com/de/blueprints/index/index/p/${page}`;
		const fetchSettings: RequestInit = {
			timeout: 10000,
			follow: 20,
			headers: {
				'User-Agent': 'Satisfactory - Calculator'
			}
		};

		const pageContent = await fetch(fetchPageUrl, fetchSettings)
			.then((e) => e.text())
			.catch(console.error);
		if (pageContent) {
			// find all relative url from a on the page
			const urls: string[] = Array.from(
				new Set<string>(
					Array.from(pageContent.matchAll(/<a\s+(?:[^>]*?\s+)?href=(["'])(.*?)\1/g))
						.map((e: any) => e[2]! as string)
						.filter((e: any) => e.includes('/blueprints/index/details/id'))
				)
			);

			const results = await Promise.all(
				urls.map(async (url) => {
					const id = url.match(/\/blueprints\/index\/details\/id\/(\d+)/)![1]!;
					//console.info( "SCIM", "QueryID:", id, "| page:", page );
					if (blacklist.has(id)) {
						return true;
					}
					if (calledIds.has(id)) {
						return false;
					}
					calledIds.add(id);

					const content = await fetch(`https://satisfactory-calculator.com${url}`, fetchSettings)
						.then((e) => e.text())
						.catch(console.error);
					if (!content) {
						return true;
					}

					const foundUrls: string[] = Array.from(
						new Set<string>(
							Array.from(content.matchAll(/<a\s+(?:[^>]*?\s+)?href=(["'])(.*?)\1/g))
								.map((e: any) => e[2]! as string)
								.filter((e: any) => e.includes('/blueprints/index/download/') || e.includes('/blueprints/index/download-cfg/'))
						)
					);

					const foundImageUrls: string[] = Array.from(
						new Set<string>(
							Array.from(content.matchAll(/<img\s+(?:[^>]*?\s+)?src=(["'])(.*?)\1/g))
								.map((e: any) => e[2]! as string)
								.filter((e: any) => e.includes('data/blueprintsInGame'))
						)
					);

					const categories: string[] = Array.from(
						new Set<string>(
							Array.from(content.matchAll(/<a\s+(?:[^>]*?\s+)?href=(["'])(.*?)\1/g))
								.map((e: any) => e[2]! as string)
								.filter((e: any) => e.includes('/category/'))
								.map((e: any) => e.split('/').at(-1)!.replace('+', ' '))
						)
					);

					const scimUser: string =
						Array.from(
							new Set<string>(
								Array.from(content.matchAll(/<a\s+(?:[^>]*?\s+)?href=(["'])(.*?)\1/g))
									.map((e: any) => e[2]! as string)
									.filter((e: any) => e.includes('/user/') && e.includes('/blueprints/index/'))
									.map((e: any) => e.split('/').at(-1))
							)
						)[0] ?? 'Unknown';

					const fetchUrlSbp = `https://satisfactory-calculator.com${foundUrls.find((e) => e.includes('download/'))!}`;
					const fetchUrlSbpcfg = `https://satisfactory-calculator.com${foundUrls.find((e) => e.includes('download-cfg/'))!}`;

					if (!fetchUrlSbp || !fetchUrlSbpcfg) {
						return false;
					}

					let originalName: string | null = null;
					const asArr = content.split('\n');
					const idx = asArr.findIndex((e) => e.includes('"breadcrumb-item"'));
					if (idx > -1) {
						originalName =
							asArr[idx + 1]
								?.replace('</li>', '')
								.trim()
								.replace(/[/\\?%*:|"<>]/g, '')
								.replace('°', '') || 'null';
					}

					const tmpDir = mountHandler.tempScim;
					const imageFiles = new Set<string>();

					const getFilePathAndName = (fileEnding: 'sbp' | 'sbpcfg' | 'jpg', id?: number): string => {
						!existsSync(tmpDir) && mkdirSync(tmpDir, { recursive: true });
						return path.join(tmpDir, `${originalName}${id ?? ''}.${fileEnding}`);
					};

					if (!originalName) {
						return true;
					}

					let imageId = 0;
					for (const imgUrl of foundImageUrls) {
						const response = await fetch(imgUrl, fetchSettings).catch(() => {});
						const file = getFilePathAndName('jpg', imageId);
						if (response) {
							await writeFile(file, await response.buffer()).catch(console.error);
							imageFiles.add(file);
						} else {
							copyFileSync(path.join(process.cwd(), 'public/images/default', 'default.jpg'), file);
							console.info('SCIM', 'default image used:', originalName);
						}
						imageId++;
					}

					let response = await fetch(fetchUrlSbpcfg, fetchSettings).catch(console.error);
					if (response) {
						await writeFile(getFilePathAndName('sbpcfg'), await response.buffer());
					} else {
						return true;
					}

					response = await fetch(fetchUrlSbp, fetchSettings).catch(console.error);
					if (response) {
						await writeFile(getFilePathAndName('sbp'), await response.buffer());
					} else {
						return true;
					}

					if (!existsSync(getFilePathAndName('sbp')) || !existsSync(getFilePathAndName('sbpcfg'))) {
						return true;
					}

					if (readFileSync(getFilePathAndName('sbp')).toString().startsWith('<') || readFileSync(getFilePathAndName('sbpcfg')).toString().startsWith('<')) {
						return true;
					}

					try {
						const filePath = getFilePathAndName('sbp').split(/[\\/]/);
						const fileName = filePath.pop()!.replace('.sbp', '');
						//console.log( fileName, filePath.join( "/" ) );
						const BP = new BlueprintReader(join(filePath.join('/')), fileName);
						if (BP.success) {
							const bpDb = await prisma.blueprints.findFirst({ where: { SCIMId: parseInt(id) } });
							let newBp: Blueprint;
							if (!bpDb) {
								newBp = await createNewBlueprint({
									name: originalName,
									description: `Blueprint hosted by Satisfactory - Calculator`,
									originalName,
									designerSize: DesignerSize.mk0,
									userId: user!.id,
									categories,
									scimUser,
									images: [],
									SCIMId: parseInt(id)
								});
							} else {
								newBp = await Blueprint.create(bpDb);
							}

							const blueprintDir = path.join(mountHandler.blueprintDir, newBp.dbData.id);
							existsSync(blueprintDir) && rmSync(blueprintDir, { recursive: true });
							mkdirSync(blueprintDir, { recursive: true });

							const images: string[] = [];
							renameSync(getFilePathAndName('sbp'), path.join(blueprintDir, `${newBp.dbData.id}.sbp`));
							renameSync(getFilePathAndName('sbpcfg'), path.join(blueprintDir, `${newBp.dbData.id}.sbpcfg`));
							for (let i = 0; i < imageFiles.size; i++) {
								const filePath = getFilePathAndName('jpg', i);
								const targetFile = path.join(blueprintDir, `image_${newBp.dbData.id}_${i}.jpg`);
								if (!existsSync(filePath)) {
									continue;
								}

								await Jimp.read(filePath)
									.then((image) => image.resize(Jimp.AUTO, 512).write(targetFile))
									.then(() => images.push(`image_${newBp.dbData.id}_${i}.jpg`))
									.then(() => rmSync(filePath))
									.catch(console.error);
							}

							await prisma.blueprints
								.update({
									where: { id: newBp.dbData.id },
									data: {
										images,
										name: originalName,
										description: BP.blueprintData.config.description,
										categories,
										scimUser,
										originalName,
										iconData: {
											iconID: BP.blueprintData.config.iconID,
											color: BP.blueprintData.config.color
										}
									}
								})
								.catch(() => {
									calledIds.delete(id);
									newBp.delete();
									console.info('SCIM', `removed:`, originalName);
									return true;
								})
								.then(() => {
									console.info('SCIM', `created/updated:`, originalName, ' > images', images.length);
									return true;
								});

							for (const mod of (await newBp.getData(true))?.mods || []) {
								mods.add(mod);
							}

							for (const cat of categories) {
								allCategories.add(cat);
							}

							return true;
						}
					} catch (e) {
						return true;
					}
				})
			);

			if (results.includes(false)) {
				break outLoop;
			}
		}
	}

	for (const old of await prisma.blueprints.findMany({
		where: {
			originalName: { in: Array.from(calledIds) },
			SCIMId: { gte: 0 }
		}
	})) {
		const bp = await Blueprint.create(old);
		await bp.delete();
		console.info('SCIM', `removed:`, old.originalName);
	}

	Promise.all(
		(await prisma.blueprints.findMany({})).map(async (bp) => {
			const blueprintDir = path.join(mountHandler.blueprintDir, bp.id);
			const bpClass = await Blueprint.create(bp);
			if (!existsSync(blueprintDir)) {
				await bpClass.delete();
				console.info('SCIM', `removed:`, bp.originalName);
			} else {
				await bpClass
					.updateMods()
					.then(() => console.info('SCIM', 'updated:', bp.originalName))
					.catch(() => {
						console.info('SCIM', `removed:`, bp.originalName);
						return bpClass.delete();
					});
			}
		})
	);

	Promise.all(
		Array.from(allCategories).map(async (name) =>
			prisma.categories.upsert({
				where: { name },
				update: {},
				create: { name }
			})
		)
	);
	rmSync(mountHandler.tempScim, { recursive: true, force: true });
	await prisma.mods.deleteMany({ where: { modRef: { notIn: Array.from(mods) } } });
	await kbotApi.getMods(Array.from(mods));
});

import { FileAdapter } from '#imports';
import axios from 'axios';
import compressing from 'compressing';
import { join } from 'node:path';
import { log } from '~/utils/logger';

export function parseInformationFromBlueprintConfig(content: string) {
	const foundImageUrls: string[] = Array.from(
		new Set<string>(
			Array.from(content.matchAll(/<img\s+(?:[^>]*?\s+)?src=(["'])(.*?)\1/g))
				.map((e: any) => {
					return e[2]! as string;
				})
				.filter((e: any) => {
					return e.includes('data/blueprintsInGame');
				})
		)
	);

	const categories: string[] = Array.from(
		new Set<string>(
			Array.from(content.matchAll(/<a\s+(?:[^>]*?\s+)?href=(["'])(.*?)\1/g))
				.map((e: any) => {
					return e[2]! as string;
				})
				.filter((e: any) => {
					return e.includes('/category/');
				})
				.map((e: any) => {
					return e.split('/').at(-1)!.replace('+', ' ');
				})
		)
	);

	const scimUser: string =
		Array.from(
			new Set<string>(
				Array.from(content.matchAll(/<a\s+(?:[^>]*?\s+)?href=(["'])(.*?)\1/g))
					.map((e: any) => {
						return e[2]! as string;
					})
					.filter((e: any) => {
						return e.includes('/user/') && e.includes('/blueprints/index/');
					})
					.map((e: any) => {
						return e.split('/').at(-1);
					})
			)
		)[0] ?? 'Unknown';

	return { foundImageUrls, categories, scimUser };
}

export const calculatorPages = axios.create({
	baseURL: 'https://satisfactory-calculator.com/de/blueprints/index/index/p/',
	responseType: 'text',
	timeout: 7500
});

export const calculatorBlueprintPage = axios.create({
	baseURL: 'https://satisfactory-calculator.com',
	responseType: 'text',
	timeout: 7500
});

export const calculatorBlueprintDownloader = axios.create({
	baseURL: 'https://satisfactory-calculator.com/de/blueprints/index',
	responseType: 'arraybuffer',
	timeout: 7500
});

export async function downloadBlueprint(blueprintId: string | number, blueprintName: string) {
	const rootPath = join(process.cwd(), 'blueprints');

	const sbpPath = join(rootPath, String(blueprintId), `${blueprintName}.sbp`);
	const sbpcfgPath = join(rootPath, String(blueprintId), `${blueprintName}.sbpcfg`);
	const zipPath = join(rootPath, String(blueprintId), `${blueprintName}.zip`);

	// /de/blueprints/index/details/id/5313/name/Water+Ring
	let [sbp, sbpcfg] = await Promise.all([
		calculatorBlueprintDownloader
			.get(`/download/id/${blueprintId}/name/${blueprintName}`)
			.then(async (r) => {
				await FileAdapter.write(r.data, sbpPath);
				return r;
			})
			.catch((e) => {
				log('tasks-error', 'Error fetching blueprint', e.message);
				return {
					data: null
				};
			}),
		calculatorBlueprintDownloader
			.get(`/download-cfg/id/${blueprintId}/name/${blueprintName}`)
			.then(async (r) => {
				await FileAdapter.write(r.data, sbpcfgPath);
				return r;
			})
			.catch((e) => {
				log('tasks-error', 'Error fetching blueprint cfg', e);
				return {
					data: null
				};
			})
	]);

	if (sbp?.data && sbpcfg?.data) {
		const zipStream = new compressing.zip.Stream();
		zipStream.addEntry(sbpPath);
		zipStream.addEntry(sbpcfgPath);
		await FileAdapter.writeAxiosStream(zipStream, zipPath).catch((e) => {
			log('tasks-error', 'Error writing zip', e.message);
			sbp = { data: null };
			sbpcfg = { data: null };
		});
	}

	if (!sbp?.data || !sbpcfg?.data) {
		await FileAdapter.remove(sbpPath.split('/').slice(0, -1).join('/'));
	}

	return {
		blueprintId: Number(String(blueprintId)),
		blueprintName,
		folder: sbpPath.split('/').slice(0, -1).join('/'),
		remove() {
			return FileAdapter.remove(sbpPath.split('/').slice(0, -1).join('/')).catch(() => {});
		},
		zip: zipPath,
		zipSize: await FileAdapter.size(zipPath),
		sbp: sbp?.data
			? {
					path: sbpPath,
					filename: `${blueprintName}.sbp`
				}
			: null,
		sbpcfg: sbpcfg?.data
			? {
					path: sbpcfgPath,
					filename: `${blueprintName}.sbpcfg`
				}
			: null
	};
}

import { FileAdapter } from '#imports';
import axios from 'axios';
import { join } from 'node:path';
import { log } from '~/utils/logger';

export function parseInformationFromBlueprintConfig(content: string) {
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

	return { foundImageUrls, categories, scimUser };
}

export const calculatorPages = axios.create({
	baseURL: 'https://satisfactory-calculator.com/de/blueprints/index/index/p/',
	responseType: 'text',
	timeout: 10000
});

export const calculatorBlueprintPage = axios.create({
	baseURL: 'https://satisfactory-calculator.com',
	responseType: 'text',
	timeout: 10000
});

export const calculatorBlueprintDownloader = axios.create({
	baseURL: 'https://satisfactory-calculator.com/de/blueprints/index',
	responseType: 'arraybuffer',
	timeout: 10000
});

export async function downloadBlueprint(blueprintId: string | number, blueprintName: string) {
	const rootPath = join(process.cwd(), 'blueprints');

	const sbpPath = join(rootPath, String(blueprintId), `${blueprintName}.sbp`);
	const sbpcfgPath = join(rootPath, String(blueprintId), `${blueprintName}.sbpcfg`);

	// /de/blueprints/index/details/id/5313/name/Water+Ring
	const [sbp, sbpcfg] = await Promise.all([
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
				log('tasks-error', 'Error fetching blueprint cfg', e.message);
				return {
					data: null
				};
			})
	]);

	if (!sbp?.data || !sbpcfg?.data) {
		await FileAdapter.remove(sbpPath.split('/').slice(0, -1).join('/'));
	}

	return {
		blueprintId: Number(String(blueprintId)),
		blueprintName,
		folder: sbpPath.split('/').slice(0, -1).join('/'),
		remove() {
			return FileAdapter.remove(sbpPath.split('/').slice(0, -1).join('/'));
		},
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

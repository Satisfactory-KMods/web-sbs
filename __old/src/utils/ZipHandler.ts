import { env } from '@/env';
import { prisma } from '@/server/db';
import type { Blueprints } from '@prisma/client';
import * as compress from 'compressing';
import { copyFileSync, createWriteStream, existsSync, mkdirSync, rmSync, writeFileSync } from 'fs';
import { join } from 'path';
import z from 'zod';
import { mountHandler } from './MoundHandler';

export interface ZipMeta {
	file: string;
	timestamp: Record<string, number>;
}

const fileValidate = z.string().refine((v) => v === 'sbp' || v === 'sbpcfg');

class ZipHandler {
	public async getFileDownload(id: string, file: string, ip?: string): Promise<[string, string] | undefined> {
		fileValidate.parse(file);
		const data = await prisma.blueprints.findUnique({ where: { id } });
		if (data) {
			if (ip && !data.downloadIps.includes(ip)) {
				await prisma.blueprints.update({
					where: { id },
					data: { downloads: data.downloads + 1, downloadIps: [...data.downloadIps, ip] }
				});
			}
			return [join(mountHandler.blueprintDir, data.id, data.id + '.' + file), data.originalName + '.' + file];
		}
		return undefined;
	}

	public async getOrCreatePack(id: string, ip?: string): Promise<string | undefined> {
		const data = await prisma.blueprintPacks.findUnique({ where: { id } });
		if (data) {
			const blueprints = await prisma.blueprints.findMany({ where: { id: { in: data.blueprints } } });
			const zipDirPath = join(mountHandler.zipDir, data.id);
			const stamps = this.toTimeStamps(blueprints);
			const meta = this.getMeta(join(zipDirPath, 'meta.json'), stamps);

			if (ip) {
				for (const bp of blueprints) {
					if (!bp.downloadIps.includes(ip)) {
						await prisma.blueprints.update({
							where: { id: bp.id },
							data: { downloads: bp.downloads + 1, downloadIps: [...bp.downloadIps, ip] }
						});
					}
				}

				if (!data.downloadIps.includes(ip)) {
					await prisma.blueprintPacks.update({
						where: { id },
						data: { downloads: data.downloads + 1, downloadIps: [...data.downloadIps, ip] }
					});
				}
			}

			if (meta) {
				return meta.file;
			} else {
				return await this.createZip(blueprints, zipDirPath, data.id + '.zip', stamps).catch((e) => {
					console.error(e);
					return undefined;
				});
			}
		}
		return undefined;
	}

	public async getOrCreateBlueprint(id: string, ip?: string): Promise<string | undefined> {
		const data = await prisma.blueprints.findUnique({ where: { id } });
		if (data) {
			const zipDirPath = join(mountHandler.zipDir, data.id);
			const stamps = this.toTimeStamps([data]);
			const meta = this.getMeta(join(zipDirPath, 'meta.json'), stamps);

			if (ip && !data.downloadIps.includes(ip)) {
				await prisma.blueprints.update({
					where: { id },
					data: { downloads: data.downloads + 1, downloadIps: [...data.downloadIps, ip] }
				});
			}

			if (meta) {
				return meta.file;
			} else {
				return await this.createZip([data], zipDirPath, data.id + '.zip', stamps).catch((e) => {
					console.error(e);
					return undefined;
				});
			}
		}
		return undefined;
	}

	private renameToOriginal(id: string, originalName: string, end: '.sbp' | '.sbpcfg'): string {
		const filePath = join(mountHandler.blueprintDir, id);
		const sourceFile = join(filePath, id + end);
		const renameFile = join(filePath, originalName + end);
		if (existsSync(renameFile)) {
			rmSync(renameFile);
		}
		copyFileSync(sourceFile, renameFile);
		return renameFile;
	}

	private async createZip(blueprints: Blueprints[], zipDirPath: string, zipDirFile: string, timeStamps: Record<string, number>): Promise<string | undefined> {
		if (existsSync(zipDirPath)) {
			rmSync(zipDirPath, { recursive: true });
		}
		const filePath = join(zipDirPath, zipDirFile);
		const zipStream = new compress.zip.Stream();

		const removeFiles = new Set<string>();

		for (const bp of blueprints) {
			const sbpFile = this.renameToOriginal(bp.id, bp.originalName, '.sbp');
			const sbpcfgFile = this.renameToOriginal(bp.id, bp.originalName, '.sbpcfg');
			removeFiles.add(sbpFile);
			removeFiles.add(sbpcfgFile);
			zipStream.addEntry(sbpFile);
			zipStream.addEntry(sbpcfgFile);
		}

		mkdirSync(zipDirPath, { recursive: true });
		const destStream = createWriteStream(filePath);
		return await new Promise<undefined | string>((resolve, reject) => {
			zipStream
				.pipe(destStream)
				.on('finish', () => {
					writeFileSync(
						join(zipDirPath, `meta.json`),
						JSON.stringify({
							file: join(zipDirPath, zipDirFile),
							timestamp: timeStamps
						})
					);

					for (const file of removeFiles) {
						if (existsSync(file)) {
							rmSync(file);
						}
					}

					resolve(join(zipDirPath, zipDirFile));
				})
				.on('error', (err) => {
					console.error("Blueprint Pack can't create: " + err.message);
					reject(undefined);
				});
		});
	}

	private toTimeStamps(blueprints: Blueprints[]): Record<string, number> {
		return blueprints.reduce<Record<string, number>>((last, bp) => ({ ...last, [bp.id]: bp.updatedAt.valueOf() }), {});
	}

	private getMeta(metaDirPath: string, timeStamps: Record<string, number>): ZipMeta | undefined {
		if (existsSync(metaDirPath)) {
			const meta = join(metaDirPath, 'meta.json');
			if (existsSync(meta)) {
				try {
					const data = JSON.parse(meta);
					if (typeof data === 'object' && data !== null) {
						if (typeof data.file === 'string' && typeof data.timestamp === 'number') {
							return data;
						}
					}
				} catch (e) {
					if (e instanceof Error) {
						console.error(e.message);
					}
				}
			}
		}
		return undefined;
	}
}

const globalForKbotApi = globalThis as unknown as {
	zipHandler: ZipHandler | undefined;
};

export const zipHandler = globalForKbotApi.zipHandler ?? new ZipHandler();

if (env.NODE_ENV !== 'production') {
	globalForKbotApi.zipHandler = zipHandler;
}

import { upload } from '@/server/src/Lib/Multer.Lib';
import MongoBlueprints from '@/server/src/MongoDB/MongoBlueprints';
import type { User } from '@/src/Shared/Class/User.Class';
import { dataResponse, errorResponse } from '@kyri123/lib';
import { ApiUrl, MWAuth } from '@server/Lib/Express.Lib';
import type { ExpressRequest } from '@server/Types/express';
import { EApiBlueprintUtils } from '@shared/Enum/EApiPath';
import type { Response } from 'express';
import fs from 'fs';
import _ from 'lodash';
import path from 'path';

export default function () {
	Router.post(
		ApiUrl(EApiBlueprintUtils.bulkUpdate),
		upload.array('blueprints', 200),
		MWAuth,
		async (
			req: ExpressRequest<{
				UserClass: User;
				blueprintName: string;
			}>,
			res: Response
		) => {
			if (req.files && Array.isArray(req.files) && Number(req.files.length) >= 2) {
				try {
					const checkedBlueprints = new Map<string, Map<string, Express.Multer.File>>();
					for (const file of req.files) {
						if (file.originalname.endsWith('.sbp') || file.originalname.endsWith('.sbpcfg')) {
							const isSbp = file.originalname.endsWith('.sbp');
							const rawFilename = isSbp ? file.originalname.replace('.sbp', '') : file.originalname.replace('.sbpcfg', '');
							if (!checkedBlueprints.has(rawFilename)) {
								checkedBlueprints.set(rawFilename, new Map<string, Express.Multer.File>());
								checkedBlueprints.get(rawFilename)?.set(isSbp ? '.sbp' : '.sbpcfg', file);
							} else {
								checkedBlueprints.get(rawFilename)?.set(isSbp ? '.sbp' : '.sbpcfg', file);
							}
						}
					}

					let updatedCount = 0;
					for (const [originalName, files] of checkedBlueprints) {
						const blueprintDocument = await MongoBlueprints.findOne({ originalName });
						const sbp = files.get('.sbp');
						const sbpcfg = files.get('.sbpcfg');
						if (blueprintDocument && sbp && sbpcfg) {
							if (_.isEqual(blueprintDocument.owner.toString(), req.body.UserClass.Get._id)) {
								const sbpFile = path.join(
									__BlueprintDir,
									blueprintDocument._id.toString(),
									`${blueprintDocument._id.toString()}.sbp`
								);
								const sbpcfgFile = path.join(
									__BlueprintDir,
									blueprintDocument._id.toString(),
									`${blueprintDocument._id.toString()}.sbpcfg`
								);

								fs.existsSync(sbpFile) && fs.rmSync(sbpFile, { recursive: true });
								fs.existsSync(sbpcfgFile) && fs.rmSync(sbpcfgFile, { recursive: true });

								fs.renameSync(sbp.path, sbpFile);
								fs.renameSync(sbpcfg.path, sbpcfgFile);

								await blueprintDocument.updateModRefs(true);
								updatedCount++;
							}
						}
					}

					return res.status(200).json(dataResponse({ message: `${updatedCount} blueprints was updated.` }));
				} catch (e) {
					if (e instanceof Error) {
						SystemLib.LogError('api', e.message);
					}
				}
			}

			return res.status(500).json(errorResponse('Something goes wrong!', res));
		}
	);
}

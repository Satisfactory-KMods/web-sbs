import MongoBlueprints from '@/server/src/MongoDB/MongoBlueprints';
import { JobTask } from '@server/Tasks/TaskManager';
import { default as fs } from 'fs';
import { default as fsp } from 'fs/promises';
import path from 'path';

const time = 1800000 * 2 * 24;

export default new JobTask(time, 'MakeItCleanDeepCheck', async () => {
	SystemLib.Log('tasks', 'Running Task', SystemLib.ToBashColor('Red'), 'MakeItCleanDeepCheck');

	if (fs.existsSync(__BlueprintDir)) {
		for (const Dir of fs.readdirSync(__BlueprintDir)) {
			try {
				if (!(await MongoBlueprints.exists({ _id: Dir }))) {
					SystemLib.LogWarning('tasks', 'Remove data for blueprint (not exsisting anymore!):', Dir);
					await fsp.rm(path.join(__BlueprintDir, Dir), { recursive: true }).catch((e) => SystemLib.LogError('tasks', e.message));
					continue;
				}
			} catch (e) {
				SystemLib.LogError('tasks', e);
			}
		}
	}
});

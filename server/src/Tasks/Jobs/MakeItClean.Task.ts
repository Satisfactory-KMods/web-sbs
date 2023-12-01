import { MongoBlueprintPacks } from '@/server/src/MongoDB/MongoBlueprints';
import { JobTask } from '@server/Tasks/TaskManager';
import fs from 'fs';
import path from 'path';

const time = 1800000 / 2;

export default new JobTask(time, 'MakeItClean', async () => {
	SystemLib.Log('tasks', 'Running Task', SystemLib.ToBashColor('Red'), 'MakeItClean');

	// remove all empty blueprint packs
	await MongoBlueprintPacks.deleteMany({ 'blueprints.0': { $exists: false } });
	global.DownloadIPCached.clear();
	let ZipPath = path.join(__MountDir, 'Zips');
	if (fs.existsSync(ZipPath)) {
		for (const Dir of fs.readdirSync(ZipPath)) {
			const DirPath = path.join(ZipPath, Dir);
			const State = fs.statSync(DirPath);
			if (State.isDirectory()) {
				const CreateFile = path.join(DirPath, 'created.log');
				if (!fs.existsSync(CreateFile)) {
					SystemLib.LogWarning('tasks', 'Remove Zip for BP:', DirPath);
					fs.rmSync(DirPath, { recursive: true });
					continue;
				}
				const Time = parseInt(fs.readFileSync(CreateFile).toString());
				if (Time <= Date.now() - time) {
					SystemLib.LogWarning('tasks', 'Remove Zip for BP:', DirPath);
					fs.rmSync(DirPath, { recursive: true });
				}
			} else {
				SystemLib.LogWarning('tasks', 'Remove Zip for BP:', DirPath);
				fs.rmSync(DirPath, { recursive: true });
			}
		}
	}

	ZipPath = path.join(__MountDir, 'PackZips');
	if (fs.existsSync(ZipPath)) {
		for (const Dir of fs.readdirSync(ZipPath)) {
			const DirPath = path.join(ZipPath, Dir);
			const State = fs.statSync(DirPath);
			if (State.isDirectory()) {
				const CreateFile = path.join(DirPath, 'created.log');
				if (!fs.existsSync(CreateFile)) {
					SystemLib.LogWarning('tasks', 'Remove Zip for BP:', DirPath);
					fs.rmSync(DirPath, { recursive: true });
					continue;
				}
				const Time = parseInt(fs.readFileSync(CreateFile).toString());
				if (Time <= Date.now() - time) {
					SystemLib.LogWarning('tasks', 'Remove Zip for BP:', DirPath);
					fs.rmSync(DirPath, { recursive: true });
				}
			} else {
				SystemLib.LogWarning('tasks', 'Remove Zip for BP:', DirPath);
				fs.rmSync(DirPath, { recursive: true });
			}
		}
	}
});

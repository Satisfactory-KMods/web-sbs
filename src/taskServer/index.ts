import { TaskManagerClass } from '@/taskServer/taskManager/TaskManager';
import 'dotenv/config';

async function main() {
	const taskManager = new TaskManagerClass();
	await taskManager.init();
}

main();

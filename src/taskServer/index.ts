import 'dotenv/config';
import { TaskManagerClass } from "./taskManager/TaskManager";


async function main() {
	const taskManager = new TaskManagerClass();
	await taskManager.init();
}

main();

import { TaskManagerClass } from "./Tasks/TaskManager";


async function main() {
	global.TaskManager = new TaskManagerClass();
	await TaskManager.Init();
}

main();

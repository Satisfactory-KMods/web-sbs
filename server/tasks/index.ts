import installBlueprintPraseTask from './blueprint-parse';

export function installAllTasks() {
	installBlueprintPraseTask('0 */1 * * *', true);
}

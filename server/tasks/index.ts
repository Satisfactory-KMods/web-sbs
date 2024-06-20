import installBlueprintPraseTask from './blueprint-parse';

export function installAllTasks() {
	installBlueprintPraseTask('*/15 * * * *', true);
}

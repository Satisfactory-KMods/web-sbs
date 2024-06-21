import installBlueprintPraseTask from './blueprint-parse';

export function installAllTasks() {
	// Delay init run and install by 2 seconds
	setTimeout(() => {
		installBlueprintPraseTask('0 */1 * * *', true);
	}, 2000);
}

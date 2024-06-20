import { log } from '~/utils/logger';
import { installAllTasks } from '../tasks';

export default defineNitroPlugin(() => {
	log('log', 'Install all Tasks');
	installAllTasks();
});

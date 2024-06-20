import { log } from '~/utils/logger';
import { manageViews } from '../utils/db/postgres/mat';
import { startMigrate } from '../utils/db/postgres/pg';

export default defineNitroPlugin(async () => {
	log('log', 'Starting database migration');
	await manageViews(true);
	await startMigrate();
	await manageViews();
});

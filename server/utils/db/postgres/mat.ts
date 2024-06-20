import { migrateViews } from '@kmods/drizzle-pg/pg-core';
import { drizzle } from '@kmods/drizzle-pg/postgres-js';
import { poolConnection } from './pg';

/**
 * Destory or create the views for the database
 * @param destory - should we destory the views
 * @returns void
 */
export function manageViews(destory = false) {
	return migrateViews({
		imports: destory ? {} : {},
		service: 'kbot-dev',
		migrationDb: drizzle(poolConnection, {})
	});
}

import { safeMigrate } from '@kmods/drizzle-pg/pg-core';
import { drizzle } from '@kmods/drizzle-pg/postgres-js';
import * as fs from 'fs';
import { join } from 'path';
import postgres from 'postgres';
import { log } from '~~/app/utils/logger';
import { env } from '~~/env';
import * as schema from './schema/index';

export const poolConnection = postgres(env.postgres);

export const db = drizzle(poolConnection, {
	schema
});

export const dbState = {
	connected: false,
	migrated: false
};

/**
 * Start the database migration and set the state
 * @returns Promise
 */
export function startMigrate() {
	log('info', 'Starting database migration');
	if (
		dbState.migrated ||
		!fs.existsSync(join(process.cwd(), 'server/utils/db/postgres/migrations'))
	) {
		log(
			'warn',
			`Migration already complete or no migrations found (${join(process.cwd(), 'server/utils/db/postgres/migrations')})`
		);
		return Promise.resolve(dbState);
	}

	return safeMigrate(
		drizzle(poolConnection),
		postgres(env.postgres),
		join(process.cwd(), 'server/utils/db/postgres/migrations')
	)
		.then(() => {
			dbState.migrated = true;
			dbState.connected = true;
			log('info', 'Database migration complete');
			return dbState;
		})
		.catch((err) => {
			log('error', 'Database migration failed', err);
			log('fatal', err.message);
		});
}

export * from './schema/index';

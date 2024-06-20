import { defineConfig } from 'drizzle-kit';

import { env } from './env';

export default defineConfig({
	schema: './server/utils/db/postgres/schema',
	dialect: 'postgresql',
	out: './server/utils/db/postgres/migrations',
	dbCredentials: env.postgres
});

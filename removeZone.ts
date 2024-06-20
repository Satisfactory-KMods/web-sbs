import fs from 'fs/promises';
import { glob } from 'glob';

const zones = await glob('**/*:Zone.Identifier');

await Promise.all(
	zones.map(async (zone) => {
		await fs.rm(zone);
	})
);

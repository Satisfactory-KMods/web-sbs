import { z } from 'zod';

export function zodNumeric(test: unknown, message?: string) {
	return z
		.string()
		.regex(/^[0-9]*$/, message)
		.parse(test);
}

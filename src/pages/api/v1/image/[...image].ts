import type { NextPageRoute } from '@/types/Next';
import { mountHandler } from '@/utils/MoundHandler';
import { existsSync, readFileSync } from 'fs';
import NextCors from 'nextjs-cors';
import { join } from 'path';

type QueryParams = {
	image: [string, string];
};

const GET: NextPageRoute<QueryParams> = (req, res) => {
	const [id, image] = req.query.image;

	if (id && image) {
		const file = join(mountHandler.blueprintDir, id, image);
		if (file.includes(mountHandler.blueprintDir) && existsSync(file)) {
			res.setHeader('Content-Type', 'image/jpg');
			return res.send(readFileSync(file));
		}
	}

	return res.status(404).send('Not Found');
};

export const handler: NextPageRoute<QueryParams> = async (req, res) => {
	await NextCors(req, res, {
		methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
		origin: '*',
		optionsSuccessStatus: 200
	});

	if (req.method === 'GET') {
		return GET(req, res);
	}
	return res.status(405).send('Method Not Allowed');
};

export default handler;

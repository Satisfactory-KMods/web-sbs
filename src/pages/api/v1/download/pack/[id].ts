import type { NextPageRoute } from '@/types/Next';
import { zipHandler } from '@/utils/ZipHandler';
import { readFileSync } from 'fs';
import NextCors from 'nextjs-cors';


type QueryParams = {
	id: string
};

const GET: NextPageRoute<QueryParams> = async( req, res ) => {
	const { id } = req.query;

	if( id ) {
		const ip = req.headers[ 'x-forwarded-for' ] as string || req.socket.remoteAddress || '127.0.0.1';
		const zipFile = await zipHandler.getOrCreatePack( id, ip );
		if( zipFile ) {
			res.setHeader( 'Content-Type', 'application/zip' );
			return res.send( readFileSync(	zipFile ) );
		}
	}

	return res.status( 404 ).send( 'Not Found' );
};

export const handler: NextPageRoute<QueryParams> = async( req, res ) => {
	await NextCors( req, res, {
		methods: [ 'GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE' ],
		origin: '*',
		optionsSuccessStatus: 200
	} );

	if( req.method === 'GET' ) {
		return await GET( req, res );
	}
	return res.status( 405 ).send( 'Method Not Allowed' );
};

export default handler;

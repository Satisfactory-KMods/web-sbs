import type { NextPageRoute } from '@/types/Next';
import { zipHandler } from '@/utils/ZipHandler';
import { readFileSync } from 'fs';
import NextCors from 'nextjs-cors';


type QueryParams = {
	id: [string, string]
};

const GET: NextPageRoute<QueryParams> = async( req, res ) => {
	const [ id, file ] = req.query.id;

	if( id ) {
		const ip = req.headers[ 'x-forwarded-for' ] as string || req.socket.remoteAddress || '127.0.0.1';
		if( file ) {
			if( ![ 'sbp', 'sbpcfg' ].includes( file ) ) {
				return res.status( 404 ).send( 'Not Found' );
			}
			const bpZipFile = await zipHandler.getFileDownload( id, file, ip );
			if( bpZipFile ) {
				const [ downloadPath, filename ] = bpZipFile;
				res.setHeader( 'Content-Type', 'application/zip' );
				res.setHeader( 'Content-Disposition', 'attachment; filename=' + encodeURI( filename ) );
				return res.send( readFileSync( downloadPath ) );
			}
			return res.status( 404 ).send( 'Not Found' );
		}

		const zipFile = await zipHandler.getOrCreateBlueprint( id, ip );
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

/*export const GET2: NextRoute<GetParams> = ( request, { params } ) => {
	const [ id, image ] = params.image;
	if( id && image ) {
		const file = join( mountHandler.blueprintDir, id, image );
		if( file.includes( mountHandler.blueprintDir ) && existsSync( file ) ) {
			const stat = statSync( file );
			return new Response( file, {
				status: 200,
				headers: {
					'Content-Type': 'image/png'
				}
			} );
		}
	}
	return new Response( 'Not Found', {
		status: 404
	} );
};*/

import type { NextPageRoute } from '@/types/Next';
import { mountHandler } from '@/utils/MoundHandler';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';


type QueryParams = {
	image: [string, string]
};

const GET: NextPageRoute<QueryParams> = ( req, res ) => {
	const [ id, image ] = req.query.image;

	if( id && image ) {
		const file = join( mountHandler.blueprintDir, id, image );
		if( file.includes( mountHandler.blueprintDir ) && existsSync( file ) ) {
			res.setHeader( 'Content-Type', 'image/jpg' );
			return res.send( readFileSync(	file ) );
		}
	}

	return res.status( 404 ).send( 'Not Found' );
};

export const handler: NextPageRoute<QueryParams> = ( req, res ) => {
	if( req.method === 'GET' ) {
		return GET( req, res );
	}
	return res.status( 405 ).send( 'Method Not Allowed' );
};

export default handler;

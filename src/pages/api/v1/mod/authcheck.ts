import { prisma } from "@/server/db";
import type { NextPageRoute } from "@/types/Next";
import NextCors from "nextjs-cors";


const POST: NextPageRoute = async( req, res ) => {
	const key = req.headers[ 'x-account-key' ];
	if( typeof key === 'string' ) {
		const user = await prisma.user.findFirst( { where: { apiKey: key } } );
		if( user ) {
			return res.status( 200 ).json( {
				_id: user.id,
				username: user.name,
				role: user.isAdmin ? 1 : 0
			} );
		}
	}

	res.status( 401 ).json( { error: "Unauthorized" } );
};

export const handler: NextPageRoute = async( req, res ) => {
	await NextCors( req, res, {
		methods: [ "GET", "HEAD", "PUT", "PATCH", "POST", "DELETE" ],
		origin: "*",
		optionsSuccessStatus: 200
	} );

	if( req.method === "POST" ) {
		return await POST( req, res ).catch( ( e: any ) => {
			if( e instanceof Error ) {
				console.error( e );
			}
			res.status( 500 ).json( { error: 'unknown' } );
		} );
	}
	return res.status( 405 ).send( "Method Not Allowed" );
};

export default handler;

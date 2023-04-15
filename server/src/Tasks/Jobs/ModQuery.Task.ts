import { JobTask }           from "../TaskManager";
import {
	gql,
	GraphQLClient
}                            from "graphql-request";
import { ModGraphQLRequest } from "../../../../src/Shared/Types/ModQuery";
import DB_Mods               from "../../MongoDB/DB_Mods";

const client = new GraphQLClient( "https://api.ficsit.app/v2/query", { headers: {} } );
const GraphQuery = ( Offset : number ) => {
	return gql`
        query {
            getMods( filter: { limit: 100, offset: ${ Offset } } ) {
                mods {
                    mod_reference,
                    id,
                    name,
                    logo,
                    short_description,
                    source_url,
                    creator_id,
                    views,
                    downloads,
                    updated_at,
                    created_at,
                    last_version_date,
                    hidden,
                    authors{user_id, mod_id, role, user{id, username}},
                    latestVersions {alpha{version, sml_version, id}, beta{version, sml_version, id}, release{version, sml_version, id} }
                },
                count
            }
        }
	`;
};

export default new JobTask(
	1800000 * 2,
	"FicsitQuery",
	async() => {
		if ( process.env.DEV ) {
			return;
		}

		SystemLib.Log(
			"[TASKS] Running Task",
			SystemLib.ToBashColor( "Red" ),
			"FicsitQuery"
		);

		let MaxReached = false;
		let Offset = 0;
		SystemLib.LogWarning( "Start Update Mods!" );
		while ( !MaxReached ) {
			try {
				const Data : ModGraphQLRequest = await client.request( GraphQuery( Offset ) );

				for ( const Mod of Data.getMods.mods ) {
					//SystemLib.LogWarning( "Update:", Mod.mod_reference, "|", Mod.name );
					await DB_Mods.findOneAndRemove( { id: Mod.id } );
					await DB_Mods.create( Mod );
				}

				Offset += 100;
				MaxReached = Data.getMods.count < Offset;
			}
			catch ( e ) {
				console.error( e );
				MaxReached = true;
			}
		}
		SystemLib.LogWarning( "Update Mods Finished!" );
	}
);

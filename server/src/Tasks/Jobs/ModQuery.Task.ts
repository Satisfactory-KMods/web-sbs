import { JobTask }           from "@server/Tasks/TaskManager";
import {
	gql,
	GraphQLClient
}                            from "graphql-request";
import { ModGraphQLRequest } from "@shared/Types/ModQuery";
import DB_Mods               from "@server/MongoDB/DB_Mods";

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

		SystemLib.Log( "tasks",
			"Running Task",
			SystemLib.ToBashColor( "Red" ),
			"FicsitQuery"
		);

		let MaxReached = false;
		let Offset = 0;
		SystemLib.LogWarning( "tasks", "Start Update Mods!" );
		while ( !MaxReached ) {
			try {
				const Data : ModGraphQLRequest = await client.request( GraphQuery( Offset ) );

				for ( const Mod of Data.getMods.mods ) {
					await DB_Mods.findOneAndRemove( { id: Mod.id } );
					await DB_Mods.create( Mod );
				}

				Offset += 100;
				MaxReached = Data.getMods.count < Offset;
			}
			catch ( e ) {
				if ( e instanceof Error ) {
					SystemLib.LogError( "api", e.message );
				}
				MaxReached = true;
			}
		}
		SystemLib.LogWarning( "tasks", "Update Mods Finished!" );
	}
);

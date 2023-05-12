import {
	authProcedure,
	router
} from "@server/trpc/trpc";

export const auth_blueprints = router( {
	rate: authProcedure
} );

import { env } from "@/env.mjs";
import { join } from "path";


class MountHandler {
	private mounDir = process.cwd() + "/mounts";

	get blueprintDir() {
		return join( this.mounDir, "files/Blueprints" );
	}

	get zipDir() {
		return join( this.mounDir, "files/Zips" );
	}
}

const globalForKbotApi = globalThis as unknown as{
	mountHandler: MountHandler | undefined
};

export const mountHandler =  globalForKbotApi.mountHandler ?? new MountHandler();

if( env.NODE_ENV !== "production" ) {
	globalForKbotApi.mountHandler = mountHandler;
}


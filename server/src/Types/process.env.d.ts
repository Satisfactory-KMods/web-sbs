declare global {
	namespace NodeJS {
		interface ProcessEnv {
			HTTPPORT : string;
			JWTToken : string;
			MONGODB_PORT : string;
			MONGODB_HOST : string;
			MONGODB_USER : string;
			MONGODB_PASSWD : string;
			MONGODB_DATABASE : string;
		}
	}
}


export { };

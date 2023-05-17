declare global {
	namespace NodeJS {
		interface ProcessEnv {
			HTTPPORT: string;
			JWTToken: string;
			MONGOMongoPORT: string;
			MONGOMongoHOST: string;
			MONGOMongoUSER: string;
			MONGOMongoPASSWD: string;
			MONGOMongoDATABASE: string;
			// for mod requests
			APIKey: string
		}
	}
}


export { };


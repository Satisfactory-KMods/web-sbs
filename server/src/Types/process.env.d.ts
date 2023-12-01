declare global {
	namespace NodeJS {
		interface ProcessEnv {
			JWTToken: string;
			MONGO_PORT: string;
			MONGO_HOST: string;
			MONGO_USER: string;
			MONGO_PASSWORD: string;
			MONGODB_DATABASE: string;
			// for mod requests
			APIKey: string;
		}
	}
}

export {};

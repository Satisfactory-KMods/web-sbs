import { ERoles } from '@/src/Shared/Enum/ERoles';
import { MakeRandomString } from "@kyri123/k-javascript-utils";
import MongoUserAccount from '@server/MongoDB/MongoUserAccount';
import dotenv from 'dotenv';
import mongoose from 'mongoose';


dotenv.config();

mongoose
	.connect(
		`mongodb://${ process.env.MONGODB_HOST }:${ process.env.MONGODB_PORT }`,
		{
			user: process.env.MONGODB_USER,
			pass: process.env.MONGODB_PASSWD,
			dbName: process.env.MONGODB_DATABASE
		}
	)
	.then( async() => {
		while( ( await MongoUserAccount.count() ) < 300 ) {
			const newUser = new MongoUserAccount();
			newUser.role = ERoles.member;
			newUser.username = MakeRandomString( 30, "-" );
			newUser.email = MakeRandomString( 20, "" ) + "@kmods.de";
			newUser.setPassword( MakeRandomString( 30, "" ) );
			await newUser.createKey();
		}
		process.exit( 0 );
	}  );

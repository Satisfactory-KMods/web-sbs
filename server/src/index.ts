import * as path           from "path";
import { Server }          from "socket.io";
import {
	IEmitEvents,
	IListenEvents
}                          from "../../src/Shared/Types/SocketIO";
import http                from "http";
import express             from "express";
import { InstallRoutings } from "./Routings/InitRouter";
import process             from "process";
import * as mongoose       from "mongoose";
import "@kyri123/k-javascript-utils/lib/useAddons";
import fs                  from "fs";
import { SystemLib_Class } from "./Lib/System.Lib";

global.__BaseDir = __dirname;
global.__MountDir = path.join( global.__BaseDir, "../..", "mount" );
!fs.existsSync( path.join( __MountDir, "Logs" ) ) && fs.mkdirSync( path.join( __MountDir, "Logs" ) );
global.__LogFile = path.join( __MountDir, "Logs", `${ new Date().toString() }.log` );

global.SystemLib = new SystemLib_Class();

global.Api = express();
global.HttpServer = http.createServer( global.Api );

global.SocketIO = new Server<IListenEvents, IEmitEvents>( global.HttpServer, {
	cors: {
		origin: "*",
		methods: [ "GET", "POST" ]
	}
} );


global.Api.use( function( req, res, next ) {
	res.setHeader( "Access-Control-Allow-Origin", "*" );
	res.setHeader( "Access-Control-Allow-Methods", "GET, POST" );
	res.setHeader(
		"Access-Control-Allow-Headers",
		"X-Requested-With,content-type"
	);
	res.setHeader( "Access-Control-Allow-Credentials", "true" );
	next();
} );

InstallRoutings( path.join( global.__BaseDir, "Routings/Router", "Routings" ), global.Api );

mongoose
	.connect(
		`mongodb://${ process.env.MONGODB_HOST }:${ process.env.MONGODB_PORT }`,
		{
			user: process.env.MONGODB_USER,
			pass: process.env.MONGODB_PASSWD
		}
	)
	.then( async() => {
		global.SystemLib.Log( "[DB] Connected... Start API and SOCKETIO" );
		HttpServer.listen( process.env.API_EXPRESS_HTTP_PORT, () =>
			global.SystemLib.Log(
				"[API/SOCKETIO] API listen on port",
				process.env.API_EXPRESS_HTTP_PORT
			)
		);
	} );
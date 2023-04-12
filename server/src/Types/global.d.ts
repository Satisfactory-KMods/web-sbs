import { Server } from "socket.io";
import * as http  from "http";
import core       from "express";
import {
	IEmitEvents,
	IListenEvents
}                 from "../../../src/Shared/Types/SocketIO";

export declare global {
	var Api : core.Express;
	var HttpServer : http.Server<
		typeof http.IncomingMessage,
		typeof http.ServerResponse
	>;
	var SocketIO : Server<IListenEvents, IEmitEvents>;

	var __BaseDir : string;
	var __MountDir : string;

}
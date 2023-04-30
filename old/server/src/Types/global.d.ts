import { Server }           from "socket.io";
import * as http            from "http";
import core                 from "express";
import {
	IEmitEvents,
	IListenEvents
}                           from "@shared/Types/SocketIO";
import { SystemLib_Class }  from "@server/Lib/System.Lib";
import { TaskManagerClass } from "@server/Tasks/TaskManager";

export declare global {
	var DownloadIPCached : { ip : string, id : string }[];
	var SystemLib : SystemLib_Class;
	var Api : core.Express;
	var Router : core.Router;
	var HttpServer : http.Server<
		typeof http.IncomingMessage,
		typeof http.ServerResponse
	>;
	var SocketIO : Server<IListenEvents, IEmitEvents>;
	var TaskManager : TaskManagerClass;

	var __BaseDir : string;
	var __MountDir : string;
	var __LogFile : string;
	var __BlueprintDir : string;

}
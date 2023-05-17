import type { systemLibClass } from "@server/Lib/System.Lib";
import type { TaskManagerClass } from "@server/Tasks/TaskManager";
import type core from "express";
import type * as http from "http";


export declare global {
	var DownloadIPCached: { ip: string, id: string }[];
	var SystemLib: systemLibClass;
	var Api: core.Express;
	var Router: core.Router;
	var HttpServer: http.Server<
		typeof http.IncomingMessage,
		typeof http.ServerResponse
	>;
	var TaskManager: TaskManagerClass;

	var __BaseDir: string;
	var __MountDir: string;
	var __LogFile: string;
	var __BlueprintDir: string;
}

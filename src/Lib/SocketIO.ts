import type {
	Socket
} from "socket.io-client";
import {
	io
} from "socket.io-client";
import type {
	IEmitEvents,
	IListenEvents
} from "@shared/Types/SocketIO";

export const GetSocket = ( roomName : string ) : Socket<IListenEvents, IEmitEvents> => io( "/", {
	path: "/api/v1/io/",
	query: {
		roomName
	}
} );
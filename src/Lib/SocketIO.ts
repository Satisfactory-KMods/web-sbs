import {
	io,
	Socket
} from "socket.io-client";
import {
	IEmitEvents,
	IListenEvents
} from "@shared/Types/SocketIO";

export const GetSocket = ( roomName : string ) : Socket<IListenEvents, IEmitEvents> => io( "/", {
	path: "/api/v1/io/",
	query: {
		roomName
	}
} );
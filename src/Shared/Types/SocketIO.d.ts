import { DefaultEventsMap } from "socket.io/dist/typed-events";
import {
	IMO_Blueprint,
	IMO_BlueprintPack
}                           from "./MongoDB";

interface IEmitEvents extends DefaultEventsMap {
	BlueprintUpdated : ( Blueprint : IMO_Blueprint ) => void;
	BlueprintPackUpdated : ( Blueprint : IMO_BlueprintPack ) => void;
}

type IListenEvents = IEmitEvents;
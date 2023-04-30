import type { DefaultEventsMap } from "socket.io/dist/typed-events";
import type {
	MO_Blueprint,
	MO_BlueprintPack
}                           from "@shared/Types/MongoDB";

interface IEmitEvents extends DefaultEventsMap {
	BlueprintUpdated : ( Blueprint : MO_Blueprint ) => void;
	BlueprintPackUpdated : ( Blueprint : MO_BlueprintPack ) => void;
}

type IListenEvents = IEmitEvents;
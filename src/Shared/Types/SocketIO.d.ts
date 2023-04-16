import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { IMO_Blueprint }    from "./MongoDB";

interface IEmitEvents extends DefaultEventsMap {
	BlueprintUpdated : ( Blueprint : IMO_Blueprint ) => void;
}

type IListenEvents = IEmitEvents;
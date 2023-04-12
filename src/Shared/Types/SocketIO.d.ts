import { DefaultEventsMap } from "socket.io/dist/typed-events";

interface IEmitEvents extends DefaultEventsMap {
	Connect : () => void;
	OnSystemUpdate : ( Usage : ISystemUsage ) => void;
	OnPanelLogUpdated : ( Log : string[] ) => void;
	OnServerUpdated : ( Updated : Record<string, TMO_Instance> ) => void;
	OnServerRemoved : () => void;
	OnClusterUpdated : ( Updated : Record<string, IMO_Cluster> ) => void;
	OnClusterRemoved : () => void;
	SteamApiUpdated : () => void;
}

type IListenEvents = DefaultEventsMap;
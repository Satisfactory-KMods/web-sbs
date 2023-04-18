import { QueryOptions } from "mongoose";

export interface IModTagOptions<T = string> {
	readonly value : T;
	readonly label : string;
	readonly isFixed? : boolean;
	readonly isDisabled? : boolean;
}

export type ISortingOptions<T = any> = { Sort : QueryOptions<T> } & IModTagOptions<number>;
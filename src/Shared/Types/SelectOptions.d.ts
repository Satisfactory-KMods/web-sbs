export interface IModTagOptions<T = string> {
	readonly value : T;
	readonly label : string;
	readonly isFixed? : boolean;
	readonly isDisabled? : boolean;
}
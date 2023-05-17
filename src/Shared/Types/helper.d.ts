
export type IfClass<T extends boolean, ifTrue, ifFalse = null> = T extends true ? ifTrue : ifFalse;

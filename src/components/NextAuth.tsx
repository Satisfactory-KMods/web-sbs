"use client";
import { SessionProvider } from "next-auth/react";
import type { FC, PropsWithChildren } from "react";


export const NextAuthProvider: FC<PropsWithChildren> = ( { children } ) => (
	<SessionProvider>{ children }</SessionProvider>
);

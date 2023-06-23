//@ts-ignore
import { Button, TextInput } from "@/components/Flowbite";
import type { NextPageContext } from "next";
import { useRouter } from "next/router";
import type { FormEventHandler } from "react";
import { useRef, useState } from "react";
import { HiHome, HiSearch } from "react-icons/hi";

import "@/styles/globals.css";


function Error( { statusCode } ) {
	const inputRef = useRef<HTMLInputElement>( null );
	const router = useRouter();
	const [ error, setError ] = useState( false );

	const onSubmit: FormEventHandler<HTMLFormElement> = e => {
		e.preventDefault();
		const input = inputRef.current?.value;
		if( input && input.length > 0 ) {
			setError( false );
			router.push( {
				pathname: '/search',
				query: { s: encodeURIComponent( input ), p: 1 }
			} );
		} else {
			setError( true );
		}
	};

	return (
		<form onSubmit={ onSubmit } className="w-full grid h-screen place-items-center">
			<div className="flex flex-col items-center">
				<h1 className="text-7xl mb-3 font-bold text-red-600">{ statusCode }</h1>
				<div className="mb-3 text-lg font-semibold text-red-600">
                    Sorry, an error has occurred.
				</div>
				<div className="flex gap-3">
					<TextInput color={ error ? "failure" : undefined } ref={ inputRef } placeholder="Search for an item..." />
					<Button type="submit">
						<HiSearch className="text-xl" />
					</Button>
					<Button type="button" onClick={ () => router.push( "/" ) }>
						<HiHome className="text-xl" />
					</Button>
				</div>
			</div>
		</form>
	);
}

Error.getInitialProps = ( { res, err }: NextPageContext ) => {
	const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
	return { statusCode };
};

export default Error;

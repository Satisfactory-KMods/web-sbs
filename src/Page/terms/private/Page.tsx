import PolicyText from "@applib/Policy.md";
import { usePageTitle } from "@kyri123/k-reactutils";
import type { FunctionComponent } from "react";
import {
	useEffect,
	useState
} from "react";
import type { Components } from "react-markdown";
import ReactMarkdown from "react-markdown";

export const mdxComponents: Components = {
	ul: ( { children } ) => <ul className="list-disc ml-4 mt-4 mb-3">{ children }</ul>,
	li: ( { children } ) => <li className="mt-1">{ children }</li>,
	img: ( { alt, src } ) => (
		<div className="relative w-full aspect-video drop-shadow-xl">
			<img src={ src }
				alt={ alt }
				className="mt-4 mb-4" />
		</div>
	),
	h1: ( { children } ) => <h1 className="text-3xl font-bold mb-2">{ children }
		<hr className="border-gray-500 mt-2" />
	</h1>,
	h2: ( { children } ) => <h1 className="text-3xl font-bold mb-2">{ children } </h1>,
	h3: ( { children } ) => <h1 className="text-2xl font-bold mb-2">{ children } </h1>,
	h4: ( { children } ) => <h1 className="text-2xl font-bold mb-2">{ children } </h1>,
	h5: ( { children } ) => <h1 className="text-xl font-bold mb-2">{ children } </h1>,
	h6: ( { children } ) => <h1 className="text-lg font-bold mb-2">{ children } </h1>
};

const Component: FunctionComponent = () => {
	usePageTitle( `SBS - Private Policy` );
	const [ privacyPolicyText, setPrivacyPolicyText ] = useState( "" );

	useEffect( () => {
		fetch( PolicyText ).then( res => res.text() ).then( text => setPrivacyPolicyText( text ) );
	} );

	return (
		<div className="rounded-2xl bg-gray-700 border border-gray-800 p-5">
			<ReactMarkdown components={ mdxComponents } className="text-white">
				{ privacyPolicyText }
			</ReactMarkdown>
		</div>
	);
};

export {
	Component
};


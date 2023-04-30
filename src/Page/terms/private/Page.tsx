import type {
	FunctionComponent} from "react";
import {
	useEffect,
	useState
}                    from "react";
import ReactMarkdown from "react-markdown";
import PolicyText    from "@applib/lang/data/Policy.md";

const Component : FunctionComponent = () => {
	const [ privacyPolicyText, setPrivacyPolicyText ] = useState( "" );

	useEffect( () => {
		fetch( PolicyText ).then( res => res.text() ).then( text => setPrivacyPolicyText( text ) );
	} );

	return (
		<div className={ "rounded-2xl bg-neutral-800 border p-3" }>
			<ReactMarkdown>
				{ privacyPolicyText }
			</ReactMarkdown>
		</div>
	);
};

export {
	Component
};

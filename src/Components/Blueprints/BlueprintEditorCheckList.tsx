import type { FunctionComponent, PropsWithChildren } from "react";
import { FaCheck, FaQuestion, FaTimes } from "react-icons/fa";
import type { ReactElement } from "react-markdown/lib/react-markdown";

interface BlueprintEditorCheckListProps extends PropsWithChildren {
	optional?: boolean,
	done: boolean,
	label: string | ReactElement
}

const BlueprintEditorCheckList: FunctionComponent<BlueprintEditorCheckListProps> = ( { optional, done, label, children } ) => {
	const unCheckedColor = optional ? "text-yellow-500" : "text-red-500";
	const unCheckedIcon = optional ? <FaQuestion className="inline me-1 text-xl pb-1" /> : <FaTimes className="inline me-1 text-xl pb-1" />;

	return (
		<div className={ `p-3 border-b bg-gray-900 border-gray-700  ${ done ? "text-green-500" : unCheckedColor }` }>
			{ done ? <FaCheck className="inline me-1 text-xl pb-1" /> : unCheckedIcon } <b>{ label }</b> <span>{ children }</span>
		</div>
	 );
};

export default BlueprintEditorCheckList;
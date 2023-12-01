import type { FunctionComponent, PropsWithChildren } from 'react';
import { FaCheck, FaQuestion, FaTimes } from 'react-icons/fa';
import type { ReactElement } from 'react-markdown/lib/react-markdown';

interface BlueprintEditorCheckListProps extends PropsWithChildren {
	optional?: boolean;
	done: boolean;
	label: string | ReactElement;
}

const BlueprintEditorCheckList: FunctionComponent<BlueprintEditorCheckListProps> = ({ optional, done, label, children }) => {
	const unCheckedColor = optional ? 'text-yellow-500' : 'text-red-500';
	const unCheckedIcon = optional ? <FaQuestion className='me-1 inline pb-1 text-xl' /> : <FaTimes className='me-1 inline pb-1 text-xl' />;

	return (
		<div className={`border-b border-gray-700 bg-gray-900 p-3  ${done ? 'text-green-500' : unCheckedColor}`}>
			{done ? <FaCheck className='me-1 inline pb-1 text-xl' /> : unCheckedIcon} <b>{label}</b> <span>{children}</span>
		</div>
	);
};

export default BlueprintEditorCheckList;

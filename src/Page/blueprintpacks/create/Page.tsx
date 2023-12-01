import BlueprintPackEditor from '@app/Components/packs/BlueprintPackEditor';
import { usePageTitle } from '@kyri123/k-reactutils';
import type { FunctionComponent } from 'react';

export interface IFile {
	Content: FileList | undefined;
	FileName: string;
}

const Component: FunctionComponent = () => {
	usePageTitle(`SBS - Create Blueprint Pack`);
	return <BlueprintPackEditor />;
};

export { Component };

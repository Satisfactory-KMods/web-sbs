import PolicyText from '@applib/Policy.md';
import { usePageTitle } from '@kyri123/k-reactutils';
import type { FunctionComponent } from 'react';
import { useEffect, useState } from 'react';
import type { Components } from 'react-markdown';
import ReactMarkdown from 'react-markdown';

export const mdxComponents: Components = {
	ul: ({ children }) => <ul className='mb-3 ml-4 mt-4 list-disc'>{children}</ul>,
	li: ({ children }) => <li className='mt-1'>{children}</li>,
	img: ({ alt, src }) => (
		<div className='relative aspect-video w-full drop-shadow-xl'>
			<img src={src} alt={alt} className='mb-4 mt-4' />
		</div>
	),
	h1: ({ children }) => (
		<h1 className='mb-2 text-3xl font-bold'>
			{children}
			<hr className='mt-2 border-gray-500' />
		</h1>
	),
	h2: ({ children }) => <h1 className='mb-2 text-3xl font-bold'>{children} </h1>,
	h3: ({ children }) => <h1 className='mb-2 text-2xl font-bold'>{children} </h1>,
	h4: ({ children }) => <h1 className='mb-2 text-2xl font-bold'>{children} </h1>,
	h5: ({ children }) => <h1 className='mb-2 text-xl font-bold'>{children} </h1>,
	h6: ({ children }) => <h1 className='mb-2 text-lg font-bold'>{children} </h1>
};

const Component: FunctionComponent = () => {
	usePageTitle(`SBS - Private Policy`);
	const [privacyPolicyText, setPrivacyPolicyText] = useState('');

	useEffect(() => {
		fetch(PolicyText)
			.then((res) => res.text())
			.then((text) => setPrivacyPolicyText(text));
	});

	return (
		<div className='rounded-2xl border border-gray-800 bg-gray-700 p-5'>
			<ReactMarkdown components={mdxComponents} className='text-white'>
				{privacyPolicyText}
			</ReactMarkdown>
		</div>
	);
};

export { Component };

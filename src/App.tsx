import { rootRouter } from '@page/Router';
import { Spinner } from 'flowbite-react';
import { RouterProvider } from 'react-router-dom';

function App() {
	return (
		<>
			<RouterProvider
				router={rootRouter}
				fallbackElement={
					<div className='mx-auto flex flex-col items-center justify-center px-6 py-8 md:h-[100vh] lg:py-0 '>
						<div className='w-full sm:max-w-md md:mt-0 xl:p-0'>
							<div className='space-y-4 p-6 sm:p-8 md:space-y-6'>
								<Spinner size={1} light={true} color='gray'></Spinner>
							</div>
						</div>
					</div>
				}
			/>
		</>
	);
}

export default App;

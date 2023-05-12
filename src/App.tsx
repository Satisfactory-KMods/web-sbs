import { rootRouter } from "@page/Router";
import { Spinner } from "flowbite-react";
import { RouterProvider } from "react-router-dom";

function App() {
	return (
		<>
			<RouterProvider router={ rootRouter } fallbackElement={ (
				<div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-[100vh] lg:py-0 ">
					<div className="w-full md:mt-0 sm:max-w-md xl:p-0">
						<div className="p-6 space-y-4 md:space-y-6 sm:p-8">
							<Spinner size={ 1 } light={ true } color="gray"></Spinner>
						</div>
					</div>
				</div>
			) } />
		</>
	);
}

export default App;

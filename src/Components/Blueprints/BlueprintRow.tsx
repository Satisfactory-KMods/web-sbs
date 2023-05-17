import BlueprintRating from "@app/Components/Blueprints/BlueprintRating";
import { useBlueprint } from "@app/hooks/useBlueprint";
import type { BlueprintData } from "@server/MongoDB/MongoBlueprints";
import { Button } from "flowbite-react";
import type { FunctionComponent } from "react";
import { FaEye } from "react-icons/fa";
import { HiCog, HiDownload, HiTrash } from "react-icons/hi";
import { Link } from "react-router-dom";


interface IBlueprintRowProps {
	Data: BlueprintData;
	onToggled: () => Promise<void>;
}

const BlueprintRow: FunctionComponent<IBlueprintRowProps> = ( { Data, onToggled } ) => {
	const bpHook = useBlueprint( Data );
	const {
		Blueprint,
		allowedToEdit,
		remove
	} = bpHook;

	const doBlacklist = async() => {
		if( Data.blacklisted ) {
			await remove();
		} else {
			await remove();
		}
		await onToggled();
	};

	return (
		<div className="flex h-20 w-full bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
			<img className="h-full aspect-video object-cover rounded-l-lg hidden lg:block" src={ `/api/v1/image/${ Blueprint._id }/${ Blueprint.images[ 0 ] }` } alt="BlueprintLogo" />
			<span className="flex-1 p-3 px-5 text-neutral-200">
				<b className="text-xl">{ Blueprint.name }</b>
				<span className="block text-sm">Created at: { new Date( Blueprint.createdAt ).toLocaleString() }</span>
			</span>
			<div className="p-3 border-t bg-gray-700 border-gray-700 flex rounded-e-lg">
				<BlueprintRating className="flex-1 px-4 hidden lg:flex" blueprintHook={ bpHook } />
				<div className="flex items-center flex-0 px-3 lg:ps-0">
					{ allowedToEdit && <>
						<Button onClick={ doBlacklist } color="red" size="small" className="p-1 px-3">
							&nbsp;<HiTrash /> &nbsp;
						</Button>
						<Link to={ `/blueprint/edit/${ Blueprint._id }` } className="text-gray-900 bg-white border border-gray-200 hover:bg-gray-100 hover:text-blue-700 disabled:hover:bg-white focus:ring-blue-700 focus:text-blue-700 dark:bg-transparent dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 focus:ring-2 dark:disabled:hover:bg-gray-800 group flex h-min items-center justify-centertext-center font-medium focus:z-10 rounded-lg p-1 ms-2 px-3">
							&nbsp;<HiCog /> &nbsp;
						</Link>
					</> }

					<Button href={ `/api/v1/download/${ Blueprint._id }` } target="_blank" color="gray" size="small" className="p-1 px-3 ms-2">
						<HiDownload className="text-sm me-2" /> { Blueprint.downloads }
					</Button>

					<Button href={ `/blueprint/${ Blueprint._id }` } target="_blank" color="gray" size="small" className="p-1 px-3 ms-2">
						&nbsp;&nbsp;<FaEye className="text-sm me-2" />
					</Button>
				</div>
			</div>
		</div>
	);
};

export default BlueprintRow;

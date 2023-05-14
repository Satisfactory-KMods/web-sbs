import { mdxComponents } from "@app/Page/terms/private/Page";
import { useBlueprint } from "@app/hooks/useBlueprint";
import type { BlueprintData } from "@server/MongoDB/DB_Blueprints";
import { Button } from "flowbite-react";
import { useId, type FunctionComponent } from "react";
import { HiCog, HiDownload, HiTrash } from "react-icons/hi";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import { Link } from "react-router-dom";
import BlueprintRating from "./BlueprintRating";

interface IBlueprintCardProps {
	Data: BlueprintData;
	onToggled: () => Promise<void>;
}

const BlueprintCard: FunctionComponent<IBlueprintCardProps> = ( { Data, onToggled } ) => {
	const id = useId();
	const bpHook = useBlueprint( Data );
	const {
		owner,
		Blueprint,
		allowedToEdit,
		toggleBlacklist,
		Tags
	} = bpHook;

	const doBlacklist = async() => {
		await toggleBlacklist(  );
		await onToggled();
	};

	return (
		<div className="flex flex-col w-full bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
			<Link to={ `/blueprint/${ Blueprint._id }` } className="flex-1 flex flex-col">
				<div className="p-3 border-b bg-gray-700 border-gray-700 text-neutral-200 truncate text-ellipsis overflow-hidden">
					<span className="text-2xl">
						{ Blueprint.name }
					</span>
					<span className="text-xs text-gray-400 block">
						Creator: <b>{ owner.username }</b>
					</span>
				</div>
				<div className="relative aspect-video">
					<div className="absolute inset-0 flex items-center justify-center w-full h-full">
						<img className="w-full h-full object-cover" src={ `/api/v1/image/${ Blueprint._id }/${ Blueprint.images[ 0 ] }` } alt="BlueprintLogo" />
					</div>
					<div className="absolute top-0 right-0 m-3">
						<div className="bg-orange-800 p-1 px-5 rounded-lg border border-orange-700 text-white">
							{ Blueprint.mods.length ? "Modded" : "Vanilla" }
						</div>
					</div>
				</div>
				<ReactMarkdown components={ mdxComponents } className="text-neutral-200 flex-1 p-3 border-t-1 border-gray-700">
					{ `${ Blueprint.description.substring( 0, 200 ) } ...` }
				</ReactMarkdown>
			</Link>
			<div className="p-3 border-t bg-gray-700 border-gray-700 flex">
				<BlueprintRating className="flex-1" blueprintHook={ bpHook } />
				<div className="flex flex-0">
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
				</div>
			</div>
			{ !!Blueprint.tags.length && <div className="flex flex-wrap p-3 pt-0 border-t bg-gray-700 border-gray-700 text-neutral-200 text-xs">
				{ Tags.map( e => (
					<div key={ id + e._id } className="bg-gray-900 p-1 px-3 rounded-lg border border-gray-800 shadow">{ e.DisplayName }</div>
				) ) }
			</div> }
		</div>
	);
};

export default BlueprintCard;

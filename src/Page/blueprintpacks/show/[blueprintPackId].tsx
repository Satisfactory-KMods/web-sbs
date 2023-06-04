import BlueprintPackBlueprintRow from "@app/Components/packs/BlueprintPackBlueprintRow";
import BlueprintPackRating from "@app/Components/packs/BlueprintPackRating";
import type { BlueprintPackDefaultLoader } from "@app/Lib/loaderHelper";
import { mdxComponents } from "@app/Page/terms/private/Page";
import { useBlueprintPack } from "@app/hooks/useBlueprintPack";
import {
	Button
} from "flowbite-react";
import type { FunctionComponent } from "react";
import {
	useId
} from "react";
import {
	BiUser,
	BiWrench
} from "react-icons/bi";
import {
	BsHouseAdd
} from "react-icons/bs";
import { FaClock } from "react-icons/fa";
import {
	HiCog,
	HiDownload,
	HiTrash
} from "react-icons/hi";
import ReactMarkdown from "react-markdown";
import {
	Link,
	useLoaderData,
	useNavigate
} from "react-router-dom";


const Component: FunctionComponent = () => {
	const nav = useNavigate();
	const id = useId();
	const loaderData = useLoaderData() as BlueprintPackDefaultLoader;
	const bpHook = useBlueprintPack( loaderData.blueprintPack );
	const {
		mods,
		tags,
		owner,
		blueprintPack,
		blueprints,
		image,
		allowedToEdit,
		remove
	} = bpHook;

	const doRemove = async() => {
		await remove();
		nav( "/blueprintpacks/list" );
	};

	return ( <>
		<div className="grid grid-cols-1 xl:grid-cols-5 gap-3">
			<div className="xl:col-span-3 flex flex-col w-full bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
				<div className="p-3 border-b bg-gray-700 border-gray-700 rounded-t-lg text-neutral-200 truncate text-ellipsis overflow-hidden">
					<span className="text-2xl">
						{ blueprintPack.name }
					</span>
					<span className="text-xs text-gray-400 block">
						Creator: { owner.username }
					</span>
				</div>
				<div className="relative h-56 sm:h-64 xl:h-80 2xl:h-96">
					<div className="absolute inset-0 flex items-center justify-center w-full h-full">
						<img className="w-full h-full object-cover" src={ `/api/v1/image/${ image[ 0 ] }/${ image[ 1 ] }` } alt="BlueprintLogo" />
					</div>
					<div className="absolute top-0 right-0 m-3">
						<div className="bg-orange-800 p-1 px-5 rounded-lg border border-orange-700 text-white">
							{ blueprintPack.mods.length ? "Modded" : "Vanilla" }
						</div>
					</div>
				</div>
				<ReactMarkdown components={ mdxComponents }
				               className="text-neutral-200 flex-1 p-3 border-t-1 border-gray-700">
					{ blueprintPack.description }
				</ReactMarkdown>
				<div className=" p-3 border-t bg-gray-700 border-gray-700 flex">
					<BlueprintPackRating className="flex-1" blueprintHook={ bpHook } />
				</div>
				{ !!tags.length && <div className="flex flex-wrap p-3 pt-0 border-t bg-gray-700 border-gray-700 text-neutral-200 text-xs rounded-b-lg">
					{ tags.map( e => (
						<div key={ id + e._id }
						     className="bg-gray-900 p-1 px-3 rounded-lg border border-gray-800 shadow">{ e.DisplayName }</div>
					) ) }
				</div> }
			</div>

			<div className="flex flex-col xl:col-span-2 w-full bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
				<div className="flex-1 flex flex-col mb-auto">
					<div className="p-3 border-b bg-gray-900 border-gray-700 text-neutral-300 rounded-t-lg">
						<BiUser className="inline me-1 text-xl pb-1" /> <b>Creator:</b> { owner.username }
					</div>
					<div className="p-3 border-b bg-gray-900 border-gray-700 text-neutral-300">
						<BsHouseAdd className="inline me-1 text-xl pb-1" /> <b>Blueprints:</b> <span className="text-neutral-100">{ blueprints.length }</span>
					</div>
					<div className="p-3 border-b bg-gray-900 border-gray-700 text-neutral-300">
						<FaClock className="inline me-1 text-xl pb-1" /> <b>Created at:</b> <span className="text-neutral-100">{ new Date( blueprintPack.createdAt ).toLocaleString() }</span>
					</div>
					<div className="p-3 border-b bg-gray-900 border-gray-700 text-neutral-300">
						<FaClock className="inline me-1 text-xl pb-1" /> <b>Last Update:</b> <span className="text-neutral-100">{ new Date( blueprintPack.updatedAt ).toLocaleString() }</span>
					</div>
					{ !!mods.length && <div className="p-3 border-b bg-gray-900 border-gray-700 text-neutral-300">
						<BiWrench className="inline me-1 text-xl pb-1" /> <b>Used Mods:</b>
						{ mods.map( e => (
							<Link to={ `https://ficsit.app/mod/${ e.id }` } target="_blank" key={ id + e.id }
								      className="mt-2 flex hover:bg-gray-700 bg-gray-600 p-0 rounded-lg border border-gray-700 shadow">
								<img onError={ e => {
									e.currentTarget.src = "/images/default/unknown.png";
								} } src={ e.logo } alt={ e.name } className="h-8 w-8 rounded-l-lg" />
								<span className="px-2 py-1">{ e.name }</span>
							</Link>
						) ) }
					</div> }
				</div>

				<div className="flex flex-0 bg-gray-700 border-t border-gray-800 p-3">
					{ allowedToEdit && <>
						<Button onClick={ doRemove } color="red" size="small" className="p-1 px-3">
							<HiTrash className="text-sm me-2" /> Delete
						</Button>
						<Link to={ `/blueprintpacks/edit/${ blueprintPack._id }` }
						      className="text-gray-900 bg-white border border-gray-200 hover:bg-gray-100 hover:text-blue-700 disabled:hover:bg-white focus:ring-blue-700 focus:text-blue-700 dark:bg-transparent dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 focus:ring-2 dark:disabled:hover:bg-gray-800 group flex h-min items-center justify-centertext-center font-medium focus:z-10 rounded-lg p-1 ms-2 px-3">
							<HiCog className="text-sm me-2" /> Edit Blueprint
						</Link>
					</> }

					<Button href={ `/api/v1/download/pack/${ blueprintPack._id }` } target="_blank" color="gray" size="small" className="p-1 px-3 ms-2">
						&nbsp;<HiDownload />&nbsp;
					</Button>
				</div>
			</div>
		</div>

		<div className="flex flex-col gap-3 mt-3">
			<div className="p-3 border-b bg-gray-700 border-gray-700 rounded-lg text-neutral-200 truncate text-ellipsis overflow-hidden">
				<span className="text-2xl">
						Blueprints
				</span>
			</div>
			{ blueprints.map( e => ( <BlueprintPackBlueprintRow onToggled={ async() => {
				nav( 0 );
			} } Data={ e } key={ e._id } /> ) ) }
		</div>
	</> );
};

export {
	Component
};


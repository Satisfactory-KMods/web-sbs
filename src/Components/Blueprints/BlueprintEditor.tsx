import DataContext from "@app/Context/DataContext";
import { API_QueryLib } from "@app/Lib/Api/API_Query.Lib";
import { mdxComponents } from "@app/Page/terms/private/Page";
import { EApiBlueprintUtils } from "@app/Shared/Enum/EApiPath";
import { EDesignerSize } from "@app/Shared/Enum/EDesignerSize";
import { findModsFromBlueprint } from "@app/Shared/blueprintReadingHelper";
import { useAuth } from "@app/hooks/useAuth";
import type { Blueprint, SaveComponent, SaveEntity } from "@etothepii/satisfactory-file-parser";
import type { Mod } from "@kyri123/lib";
import type { BlueprintData } from "@server/MongoDB/DB_Blueprints";
import { Textarea } from "flowbite-react";
import _ from "lodash";
import type { FunctionComponent } from "react";
import { useContext, useEffect, useId, useMemo, useState } from "react";
import { BiUser, BiWrench } from "react-icons/bi";
import { BsBox, BsBoxes, BsHouseAdd } from "react-icons/bs";
import { HiDownload } from "react-icons/hi";
import { MdOutlinePhotoSizeSelectSmall } from "react-icons/md";
import ReactMarkdown from "react-markdown";
import { Link } from "react-router-dom";

interface BlueprintEditorProps {
	defaultData?: BlueprintData
}

const BlueprintEditor: FunctionComponent<BlueprintEditorProps> = ( { defaultData } ) => {
	const id = useId();
	const { user } = useAuth();
	const { mods } = useContext( DataContext );
	const [ form, setForm ] = useState<Omit<BlueprintData, "__v" | "_id" | "createdAt" | "updatedAt">>( () => {
		const defaultCopy: Partial<BlueprintData> | undefined = _.cloneDeep( defaultData );
		if( defaultCopy ) {
			delete defaultCopy.__v;
			delete defaultCopy._id;
			delete defaultCopy.createdAt;
			delete defaultCopy.updatedAt;
		}
		// todo: fells bad/wrong :/
		return defaultCopy as Omit<BlueprintData, "__v" | "_id" | "createdAt" | "updatedAt"> || {
			name: "",
			description: "",
			owner: user.Get._id,
			DesignerSize: EDesignerSize.mk1,
			mods: [],
			rating: [],
			totalRating: 0,
			tags: [],
			images: [],
			downloads: 0,
			blacklisted: false
		};
	} );
	const [ blueprintParse, setBlueprintParse ] = useState<Blueprint | undefined>( undefined );
	const [ sbpFile, setSbsFile ] = useState<File | null>( null );
	const [ sbpcfgFile, setSbscfgFile ] = useState<File | null>( null );
	const [ images, setImages ] = useState<File[] | null>( null );

	const Mods: Mod[] = useMemo( () => {
		const modRefs = findModsFromBlueprint( blueprintParse?.objects );
		return mods.filter( e => modRefs.includes( e.mod_reference ) );
	}, [ blueprintParse?.objects, mods ] ) ;

	const buildingCount = useMemo( () => {
		const objects: ( SaveEntity | SaveComponent )[] = blueprintParse?.objects || [];
		return objects.filter( e => e.type === "SaveEntity" ).length;
	}, [ blueprintParse?.objects ] );

	const totalItemCost = useMemo( () => {
		const itemCosts: [string, number][] = blueprintParse?.header.itemCosts || [];
		return itemCosts.reduce( ( total, cost ) => total + cost[ 1 ], 0 );
	}, [ blueprintParse?.header.itemCosts ] );

	// smallHelper function to set form values
	function setKey<K extends keyof BlueprintData>( key: K, value: BlueprintData[K] ) {
		setForm( curr => ( {
			...curr,
			[ key ]: value
		} ) );
	}

	useEffect( () => {
		if( sbpFile && sbpcfgFile ) {
			const form = new FormData();
			form.append( "blueprint", sbpFile );
			form.append( "blueprint", sbpcfgFile );
			form.append( "blueprintName", sbpFile.name.replace( ".sbp", "" ) );
			const result = API_QueryLib.PostToAPI( EApiBlueprintUtils.parseblueprint, form );
		}
	}, [ sbpFile, sbpcfgFile ] );

	return (
		<div className="grid grid-cols-1 xl:grid-cols-5 gap-3">
			<div className="xl:col-span-3 flex flex-col w-full bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
				<div className="p-3 border-b bg-gray-700 border-gray-700 text-neutral-200 truncate text-ellipsis overflow-hidden">
					<span className="text-2xl">
						Create a new blueprint
					</span>
				</div>
				<div className="relative h-56 sm:h-64 xl:h-80 2xl:h-96">
					<div className="absolute top-0 right-0 m-3">
						<div className="bg-orange-800 p-1 px-5 rounded-lg border border-orange-700 text-white">
							{ form.mods.length ? "Modded" : "Vanilla" }
						</div>
					</div>
				</div>
				<div className="flex">
					<Textarea />
					<ReactMarkdown components={ mdxComponents } className="text-neutral-200 flex-1 p-3 border-t-1 border-gray-700">
						{ form.description }
					</ReactMarkdown>
				</div>
			</div>

			<div className="flex flex-col xl:col-span-2 w-full bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
				<div className="flex-1 flex flex-col mb-auto">
					<div className="p-3 border-b bg-gray-900 border-gray-700 text-neutral-300 rounded-t-lg">
						<BiUser className="inline me-1 text-xl pb-1" /> <b>Creator:</b> <span className="text-neutral-100">{ user.Get.username }</span>
					</div>
					<div className="p-3 border-b bg-gray-900 border-gray-700 text-neutral-300">
						<MdOutlinePhotoSizeSelectSmall className="inline me-1 text-xl pb-1" /> <b>Designer Size:</b> <span className="text-neutral-100">{ form.DesignerSize }</span>
					</div>
					<div className="p-3 border-b bg-gray-900 border-gray-700 text-neutral-300">
						<BsHouseAdd className="inline me-1 text-xl pb-1" /> <b>Buildings:</b> <span className="text-neutral-100">{ buildingCount }</span>
					</div>
					<div className="p-3 border-b bg-gray-900 border-gray-700 text-neutral-300">
						<BsBox className="inline me-1 text-xl pb-1" /> <b>Object-Count:</b> <span className="text-neutral-100">{ blueprintParse?.objects.length || 0 }</span>
					</div>
					<div className="p-3 border-b bg-gray-900 border-gray-700 text-neutral-300">
						<BsBoxes className="inline me-1 text-xl pb-1" /> <b>Total Cost:</b> <span className="text-neutral-100">{ totalItemCost } items</span>
					</div>
					<div className="p-3 border-b bg-gray-900 border-gray-700 text-neutral-300">
						<HiDownload className="inline me-1 text-xl pb-1" /> <b>Total Downloads:</b> <span className="text-neutral-100">{ form.downloads }</span>
					</div>
					{ !!Mods.length && <div className="p-3 border-b bg-gray-900 border-gray-700 text-neutral-300">
						<BiWrench className="inline me-1 text-xl pb-1" /> <b>Used Mods:</b>
						{ Mods.map( e => {
							return (
								<Link to={ `https://ficsit.app/mod/${ e.id }` } target="_blank" key={ id + e.id } className="mt-2 flex hover:bg-gray-700 bg-gray-600 p-0 rounded-lg border border-gray-700 shadow">
									<img onError={ e => {
										e.currentTarget.src = "/images/default/unknown.png";
									} } src={ e.logo } alt={ e.name } className="h-8 w-8 rounded-l-lg" />
									<span className="px-2 py-1">{ e.name }</span>
								</Link>
							);
						} ) }
					</div> }
				</div>
			</div>
		</div>
	);
};

export default BlueprintEditor;
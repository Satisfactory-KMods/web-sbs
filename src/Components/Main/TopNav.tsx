import type {
	FunctionComponent,
	PropsWithChildren
}                             from "react";
import {
	useContext,
	useRef
}                             from "react";
import {
	Link,
	useLocation
}                             from "react-router-dom";
import LangContext            from "@context/LangContext";
import { ERoles }             from "@shared/Enum/ERoles";
import { useAuth }            from "@hooks/useAuth";
import NavigationLink         from "@comp/navigation/NavigationLink";
import NavigationDropdown     from "@comp/navigation/NavigationDropdown";
import NavigationDropdownItem from "@comp/navigation/NavigationDropdownItem";
import {
	CgAdd,
	CgLogIn,
	HiBars3,
	RiDoorOpenLine
}                             from "react-icons/all";
import { LangReadable }       from "@applib/lang/lang";

interface ITopNavProps extends PropsWithChildren {
	href : string;
	SessionRole? : ERoles;
}

export const TopNavLink : FunctionComponent<ITopNavProps> = ( { SessionRole, href, children } ) => {
	const { pathname } = useLocation();
	const { user } = useAuth();

	if ( SessionRole !== undefined && !user.HasPermssion( SessionRole ) ) {
		return null;
	}

	return (
		<li>
			<Link to={ href }
			      className={ `nav-link px-2 link-secondary ${ pathname === href ? "text-light" : "" }` }>{ children }</Link>
		</li>
	);
};


const TopNav : FunctionComponent = () => {
	const { user, loggedIn, logout } = useAuth();
	const { Lang, setLang, Code, AllCodes } = useContext( LangContext );
	const divRef = useRef<HTMLDivElement>( null );

	return (
		<nav className="bg-[#5f668c]">
			<div className="container mx-auto">
				<div className="px-2 sm:px-6 lg:px-8">
					<div className="relative flex h-16 items-center justify-between">
						<div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
							<button type="button" onClick={ () => divRef.current?.classList.toggle( "hidden" ) }
							        className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
							        aria-controls="mobile-menu" aria-expanded="false">
								<HiBars3 size={ 30 }/>
							</button>
						</div>
						<div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
							<div className="flex flex-shrink-0 items-center">
								<img className="block h-8 w-auto"
								     src="/images/logo.png"
								     alt="Kmods"/>
							</div>
							<div className="hidden sm:ml-6 sm:block">
								<div className="flex space-x-4">
									<NavigationLink to="/blueprint/list">{ Lang.Navigation.Home }</NavigationLink>
									<NavigationLink to="/blueprint/packs">{ Lang.Navigation.Packs }</NavigationLink>
									<NavigationLink to="/terms/private">{ Lang.Navigation.Privacy }</NavigationLink>
								</div>
							</div>
						</div>
						<div
							className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
							<div className="relative m-1 mt-2 ml-3">
								<NavigationDropdown image={ `/images/lang/${ Code }.png` }>
									{ AllCodes.map( ( code ) => (
										<NavigationDropdownItem key={ "lang" + code } to={ "#" }
										                        onClick={ () => setLang( code ) }>
											<img alt="flag" src={ `/images/lang/${ code }.png` } width={ 20 }
											     className={ "pb-1" }/>
											<span className="px-2">
											{ LangReadable[ code ] }
										</span>
										</NavigationDropdownItem>
									) ) }
								</NavigationDropdown>
							</div>

							<div className="relative m-1 mt-2 ml-3">
								<NavigationDropdown text={ loggedIn ? user.Get.username : Lang.Auth.SignUpIn }
								                    image={ "/images/logo.png" }>
									{ !loggedIn && (
										<>
											<NavigationDropdownItem to={ "/account/signin" }>
												<CgLogIn size={ 20 }/>
												<span className="px-2">
										{ Lang.Auth.Signin }
									</span>
											</NavigationDropdownItem>
											<NavigationDropdownItem to={ "/account/signup" }>
												<CgAdd size={ 20 }/>
												<span className="px-2">
								{ Lang.Auth.Signup }
									</span>
											</NavigationDropdownItem>
										</>
									) }

									<NavigationDropdownItem permission={ ERoles.admin }
									                        to={ "/admin/tags" }>{ Lang.Navigation.Admin_Tags }</NavigationDropdownItem>
									<NavigationDropdownItem permission={ ERoles.admin }
									                        to={ "/admin/users" }>{ Lang.Navigation.Admin_Users }</NavigationDropdownItem>
									<NavigationDropdownItem permission={ ERoles.admin }
									                        to={ "/admin/blacklisted" }>{ Lang.Navigation.Admin_BlacklistedBlueprints }</NavigationDropdownItem>


									<NavigationDropdownItem permission={ ERoles.member }
									                        to={ "/account/settings" }>{ Lang.Auth.AccSettings }</NavigationDropdownItem>
									<NavigationDropdownItem permission={ ERoles.member }
									                        to={ "/blueprint/create" }>{ Lang.Navigation.AddBlueprint }</NavigationDropdownItem>
									<NavigationDropdownItem permission={ ERoles.member }
									                        to={ "/blueprint/my" }>{ Lang.Navigation.MyBlueprints }</NavigationDropdownItem>
									<NavigationDropdownItem to={ "#" } onClick={ logout } permission={ ERoles.member }
									                        className="text-red-600">
										<RiDoorOpenLine size={ 20 }/>
										<span className="px-2">
										{ Lang.Auth.logout }
									</span>
									</NavigationDropdownItem>
								</NavigationDropdown>
							</div>
						</div>
					</div>
				</div>

				<div className="hidden sm:hidden" id="mobile-menu" ref={ divRef }>
					<div className="space-y-1 px-2 pb-3 pt-2">
						<NavigationLink to="/home" className="w-full block">Blueprints</NavigationLink>
					</div>
				</div>
			</div>
		</nav>
	);
};

export default TopNav;

import NavigationDropdown from "@comp/navigation/NavigationDropdown";
import NavigationDropdownItem from "@comp/navigation/NavigationDropdownItem";
import NavigationLink from "@comp/navigation/NavigationLink";
import { useAuth } from "@hooks/useAuth";
import { ERoles } from "@shared/Enum/ERoles";
import type { FunctionComponent } from "react";
import { useRef } from "react";
import {
	CgAdd,
	CgLogIn,
	HiBars3,
	RiDoorOpenLine
} from "react-icons/all";

const TopNav: FunctionComponent = () => {
	const { user, loggedIn, logout } = useAuth();
	const divRef = useRef<HTMLDivElement>( null );

	return (
		<nav className="bg-gray-800 border-b border-gray-700">
			<div className="container mx-auto">
				<div className="px-2 sm:px-6 lg:px-8">
					<div className="relative flex h-16 items-center justify-between">
						<div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
							<button type="button" onClick={ () => divRef.current?.classList.toggle( "hidden" ) }
							        className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
							        aria-controls="mobile-menu" aria-expanded="false">
								<HiBars3 size={ 30 } />
							</button>
						</div>
						<div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
							<div className="flex flex-shrink-0 items-center">
								<img className="block h-8 w-auto"
								     src="/images/logo.png"
								     alt="Kmods" />
							</div>
							<div className="hidden sm:ml-6 sm:block">
								<div className="flex space-x-4">
									<NavigationLink to="/blueprint/list">Blueprints</NavigationLink>
									<NavigationLink to="/blueprint/packs">Blueprint Packs</NavigationLink>
								</div>
							</div>
						</div>
						<div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
							<div className="relative m-1 mt-2 ml-3">
								<NavigationDropdown text={ loggedIn ? user.Get.username : "Sign In/Up" }>
									{ !loggedIn && (
										<>
											<NavigationDropdownItem to="/account/signin">
												<CgLogIn size={ 20 } />
												<span className="px-2">
										Sign In
												</span>
											</NavigationDropdownItem>
											<NavigationDropdownItem to="/account/signup">
												<CgAdd size={ 20 } />
												<span className="px-2">
								Sign Up
												</span>
											</NavigationDropdownItem>
										</>
									) }

									{ loggedIn && ( <>
										<NavigationDropdownItem permission={ ERoles.admin }
										                        to="/admin/tags">Admin:
											Tags</NavigationDropdownItem>
										<NavigationDropdownItem permission={ ERoles.admin }
										                        to="/admin/users">Admin:
											Users</NavigationDropdownItem>
										<NavigationDropdownItem permission={ ERoles.admin }
										                        to="/admin/blacklisted">Admin: Blueprint
											Blacklist</NavigationDropdownItem>


										<NavigationDropdownItem permission={ ERoles.member }
										                        to="/account/settings">Account
											Settings</NavigationDropdownItem>
										<NavigationDropdownItem permission={ ERoles.member }
										                        to="/blueprint/create">Create a
											Blueprint</NavigationDropdownItem>
										<NavigationDropdownItem permission={ ERoles.member }
										                        to="/blueprint/my">My
											Blueprints</NavigationDropdownItem>
										<NavigationDropdownItem to="#" onClick={ () => logout() }
										                        permission={ ERoles.member }
										                        className="text-red-600">
											<RiDoorOpenLine size={ 20 } />
											<span className="px-2">
												Logout
											</span>
										</NavigationDropdownItem>
									</> ) }
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

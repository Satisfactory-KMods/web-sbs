import {
	FunctionComponent,
	PropsWithChildren,
	useContext
}                       from "react";
import {
	Link,
	useLocation
}                       from "react-router-dom";
import { LangReadable } from "../../Lib/lang/lang";
import LangContext      from "../../Context/LangContext";
import AuthContext      from "../../Context/AuthContext";
import { ERoles }       from "../../Shared/Enum/ERoles";

interface ITopNavProps extends PropsWithChildren {
	href : string;
	SessionRole? : ERoles;
}

export const TopNavLink : FunctionComponent<ITopNavProps> = ( { SessionRole, href, children } ) => {
	const { pathname } = useLocation();
	const { UserData } = useContext( AuthContext );

	if ( SessionRole !== undefined && !UserData.HasPermssion( SessionRole ) ) {
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
	const { UserData, Logout } = useContext( AuthContext );
	const { Lang, setLang, Code, AllCodes } = useContext( LangContext );

	return (
		<header className="p-3 border-bottom flex-grow-0 bg-gray-800">
			<div className="container">
				<div
					className="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
					<Link to="/"
					      className="d-flex align-items-center mb-2 mb-lg-0 link-body-emphasis text-decoration-none">
						<img src={ "/images/logo.png" } alt="logo" className="w-10"/>
					</Link>

					<ul className="nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0 ms-4">
						<TopNavLink href="/">{ Lang.Navigation.Home }</TopNavLink>
						<TopNavLink SessionRole={ ERoles.member }
						            href="/create">{ Lang.Navigation.AddBlueprint }</TopNavLink>
						<TopNavLink SessionRole={ ERoles.member }
						            href="/my">{ Lang.Navigation.MyBlueprints }</TopNavLink>
					</ul>

					<div className="dropdown text-end me-2">
						<Link to="#" className="d-block link-dark text-decoration-none dropdown-toggle"
						      data-bs-toggle="dropdown" aria-expanded="false">
							<img alt="flag" src={ `/images/lang/${ Code }.png` }
							     width={ 45 } className={ "ps-2" }/>
						</Link>
						<ul className="dropdown-menu text-small">
							<li>
								{ AllCodes.map( ( code ) => (
									<Link key={ code } className="dropdown-item" to="#" onClick={ E => {
										E.preventDefault();
										setLang( code );
									} }>
										<img alt="flag" src={ `/images/lang/${ code }.png` }
										     width={ 30 } className={ " pb-1" }/> { LangReadable[ code ] }
									</Link>
								) ) }
							</li>
						</ul>
					</div>

					<div className="dropdown text-end">
						<Link to="#" className="d-block link-dark text-decoration-none dropdown-toggle"
						      data-bs-toggle="dropdown" aria-expanded="false">
							<img src={ UserData.GetUserImage() } alt="" width="40"
							     className="rounded-circle"/>
						</Link>
						<ul className="dropdown-menu text-small">
							{ UserData.IsValid ? (
								<>
									{ UserData.HasPermssion( ERoles.admin ) && (
										<>
											<li>
												<Link className="dropdown-item"
												      to="/admin/tags">{ Lang.Navigation.Admin_Tags }</Link>
											</li>
											<li>
												<Link className="dropdown-item"
												      to="/admin/users">{ Lang.Navigation.Admin_Users }</Link>
											</li>
											<li>
												<Link className="dropdown-item"
												      to="/admin/deletedblueprints">{ Lang.Navigation.Admin_BlacklistedBlueprints }</Link>
											</li>
											<li>
												<hr className="dropdown-divider"/>
											</li>
										</>
									) }
									<li>
										<Link className="dropdown-item"
										      to="/account-settings">{ Lang.Auth.AccSettings }</Link></li>
									<li>
										<hr className="dropdown-divider"/>
									</li>
									<li>
										<Link className="dropdown-item text-danger" to="#"
										      onClick={ Logout }>{ Lang.Auth.Logout }</Link></li>
								</>
							) : (
								<>
									<li><Link className="dropdown-item" to="/signin">{ Lang.Auth.Signin }</Link></li>
									<li><Link className="dropdown-item" to="/signup">{ Lang.Auth.Signup }</Link></li>
								</>
							) }
						</ul>
					</div>
				</div>
			</div>
		</header>
	);
};

export default TopNav;

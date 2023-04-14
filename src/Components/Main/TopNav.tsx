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

interface ITopNavProps extends PropsWithChildren {
	href : string;
}

export const TopNavLink : FunctionComponent<ITopNavProps> = ( { href, children } ) => {
	const { pathname } = useLocation();

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
		<header className="p-3 border-bottom flex-grow-0">
			<div className="container">
				<div
					className="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
					<Link to="/"
					      className="d-flex align-items-center mb-2 mb-lg-0 link-body-emphasis text-decoration-none">
					</Link>

					<ul className="nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0">
						<TopNavLink href="/">{ Lang.Navigation.Home }</TopNavLink>
						<TopNavLink href="/create">{ Lang.Navigation.AddBlueprint }</TopNavLink>
						<TopNavLink href="/my">{ Lang.Navigation.MyBlueprints }</TopNavLink>
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
									<li><Link className="dropdown-item"
									          to="/account-settings">{ Lang.Auth.AccSettings }</Link></li>
									<li>
										<hr className="dropdown-divider"/>
									</li>
									<li><Link className="dropdown-item text-danger" to="#"
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

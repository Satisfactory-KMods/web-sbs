import type { FunctionComponent } from "react";
import { useContext }             from "react";
import { Footer }                 from "flowbite-react";
import { Link }                   from "react-router-dom";
import LangContext                from "@context/LangContext";
import {
	SiDiscord,
	SiGithub,
	SiPatreon
}                                 from "react-icons/all";

const Foother : FunctionComponent = () => {
	const { Lang } = useContext( LangContext );

	return (
		<div className="bg-gray-800 border-t border-gray-700">
			<div className="container mx-auto">
				<Footer container={ true }>
					<Footer.Copyright
						href="#"
						by="Kmods | Kyri123 | Oliver Kaufmann"
						year={ 2023 }
					/>
					<Footer.LinkGroup>
						<Footer.Link as={ Link } href="/terms/private">
							{ Lang.Navigation.Privacy }
						</Footer.Link>
						<Footer.Link href="https://github.com/Kyri123/SBS" target="_blank">
							<SiGithub size={ 20 }/>
						</Footer.Link>
						<Footer.Link href="https://www.patreon.com/kmods" target="_blank">
							<SiPatreon size={ 20 }/>
						</Footer.Link>
						<Footer.Link href="https://discord.gg/ySh7RGJmuV" target="_blank">
							<SiDiscord size={ 20 }/>
						</Footer.Link>
					</Footer.LinkGroup>
				</Footer>
			</div>
		</div>
	);
};

export default Foother;
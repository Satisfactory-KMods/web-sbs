import { Footer } from "flowbite-react";
import type { FunctionComponent } from "react";
import {
	SiDiscord,
	SiGithub,
	SiPatreon
} from "react-icons/all";
import { Link } from "react-router-dom";


const Foother: FunctionComponent = () => (
	<div className="bg-gray-800 border-t border-gray-700">
		<div className="container mx-auto">
			<Footer container={ true }>
				<Footer.Copyright href="#"
					by="Kmods | Kyri123 | Oliver Kaufmann"
					year={ 2023 } />
				<Footer.LinkGroup>
					<li className="last:mr-0 md:mr-6">
						<Link to="/terms/private" className="hover:underline">Private Policy</Link>
					</li>
					<Footer.Link href="https://github.com/Kyri123/SBS" target="_blank">
						<SiGithub size={ 20 } />
					</Footer.Link>
					<Footer.Link href="https://www.patreon.com/kmods" target="_blank">
						<SiPatreon size={ 20 } />
					</Footer.Link>
					<Footer.Link href="https://discord.gg/ySh7RGJmuV" target="_blank">
						<SiDiscord size={ 20 } />
					</Footer.Link>
				</Footer.LinkGroup>
			</Footer>
		</div>
	</div>
);

export default Foother;

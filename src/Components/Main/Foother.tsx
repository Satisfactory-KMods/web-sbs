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
					by="Oliver Kaufmann"
					year={ 2023 } />
				<span className="text-sm text-gray-500 dark:text-gray-400 sm:text-center">The assets comes from Satisfactory or from websites created and owned by Coffee Stain Studios, who hold the copyright of Satisfactory.<br /> All trademarks and registered trademarks present in the image are proprietary to Coffee Stain Studios.</span>
				<Footer.LinkGroup>
					<li className="last:mr-0 md:mr-6">
						<Link to="/terms/private" className="hover:underline">Private Policy</Link>
					</li>
					<Footer.Link href="https://github.com/Kyri123/SBS" target="_blank">
						<SiGithub size={ 20 } />
					</Footer.Link>
					<Footer.Link href="https://www.patreon.com/EDSM" target="_blank">
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

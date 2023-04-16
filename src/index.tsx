import { StrictMode } from "react";
import App            from "./App";
import { createRoot } from "react-dom/client";

import "./CSS/Ribbon.scss";
import "./index.css";
import "bootstrap/dist/js/bootstrap.min.js";
import "bootstrap/dist/css/bootstrap.min.css";
import "@kyri123/k-javascript-utils/lib/useAddons";

createRoot( document.getElementById( "root" ) as HTMLElement ).render(
	<StrictMode>
		<App/>
	</StrictMode>
);

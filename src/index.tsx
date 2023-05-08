import { StrictMode } from "react";
import App            from "./App";
import { createRoot } from "react-dom/client";

import "@style/index.css";
import "@kyri123/k-javascript-utils/lib/useAddons";
import "@sweetalert2/theme-dark/dark.css";

createRoot( document.getElementById( "root" ) as HTMLElement ).render(
	<StrictMode>
		<App/>
	</StrictMode>
);

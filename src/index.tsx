import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

import "@kyri123/k-javascript-utils/lib/useAddons";
import "@style/index.css";
import "@sweetalert2/theme-dark/dark.css";

createRoot( document.getElementById( "root" ) as HTMLElement ).render(
	<StrictMode>
		<App />
	</StrictMode>
);

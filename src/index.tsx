import { StrictMode } from "react";
import App            from "./App";
import { createRoot } from "react-dom/client";

import "bootstrap/dist/js/bootstrap.min.js";
import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";

createRoot( document.getElementById( "root" ) as HTMLElement ).render(
	<StrictMode>
		<App />
	</StrictMode>
);

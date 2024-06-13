import { createRoot } from "react-dom/client";
import { App } from "app";

import "assets/font/GeneralSans.css";
import "assets/font/Switzer.css";
import "style/index.css";

const container = document.getElementById("root")!;
const root = createRoot(container);

root.render(
    <App />
);

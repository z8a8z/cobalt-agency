import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import App from "./App.jsx";
import "./styles.css";

const app = (
  <StrictMode>
    <App />
  </StrictMode>
);

if (import.meta.env.PROD) {
  hydrateRoot(document.getElementById("root"), app);
} else {
  createRoot(document.getElementById("root")).render(app);
}

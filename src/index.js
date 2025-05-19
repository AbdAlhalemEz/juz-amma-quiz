import React from "react";
import ReactDOM from "react-dom/client";
import "./App.css";
import App from "./App";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration"; // ✅ Add this line

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// ✅ Enable PWA functionality
serviceWorkerRegistration.register();

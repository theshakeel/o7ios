import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./store/store";
import 'capacitor-plugin-safe-area';
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import "./index.css";
// import { register as registerServiceWorker } from './serviceWorkerRegistration';

// registerServiceWorker();
const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  <Provider store={store}>
    <React.Suspense fallback={<div>Loading...</div>}>
      <App />
    </React.Suspense>
  </Provider>
);

reportWebVitals();

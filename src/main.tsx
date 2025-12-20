import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";

import { TempoDevtools } from "tempo-devtools";
TempoDevtools.init();

const basename = import.meta.env.BASE_URL;

// Preload critical resources
if ('requestIdleCallback' in window) {
  requestIdleCallback(() => {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = '/cde.png';
    document.head.appendChild(link);
  });
}

// Performance monitoring
if ('performance' in window && 'mark' in window.performance) {
  window.performance.mark('app-render-start');
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter basename={basename}>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);

if ('performance' in window && 'measure' in window.performance) {
  window.performance.mark('app-render-end');
  try {
    window.performance.measure('app-render', 'app-render-start', 'app-render-end');
  } catch (e) {
    // Measurement already exists
  }
}

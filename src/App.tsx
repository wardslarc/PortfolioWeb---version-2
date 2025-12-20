import { Suspense } from "react";
import { useRoutes, Routes, Route } from "react-router-dom";
import Home from "./components/home";
import routes from "tempo-routes";

// Elegant fallback loading component
const SuspenseFallback = () => (
  <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-slate-900 to-black">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
  </div>
);

function App() {
  return (
    <Suspense fallback={<SuspenseFallback />}>
      <>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
        {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
      </>
    </Suspense>
  );
}

export default App;

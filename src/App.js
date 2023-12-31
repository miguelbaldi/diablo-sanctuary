import {BrowserRouter, Routes, Route} from "react-router-dom";
import Layout from "./pages/Layout";
import NoPage from "./pages/NoPage";
import Home from "./pages/Home";
import WorldBossSpawnTimerComponent from "./pages/WorldBoss";
import HelltideComponent from "./pages/Helltide";
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="world-boss" element={<WorldBossSpawnTimerComponent />} />
          <Route path="helltide" element={<HelltideComponent/>} />
          <Route path="*" element={<NoPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
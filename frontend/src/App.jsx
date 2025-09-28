import { Outlet } from "react-router-dom";

function App() {
  return (
    <div style={{ fontFamily: "sans-serif", maxWidth: "100%", margin: 0 }}>
      <h1 style={{ textAlign: "center" }}>Technologie-Radar</h1>
      <Outlet />
    </div>
  );
}

export default App;

import React from "react";
import Envelope from "./components/Envelope";

function App() {
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fdf6e3", // optional background
      }}
    >
      <Envelope />
    </div>
  );
}
export default App;
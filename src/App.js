import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Envelope from "./components/WeddingInvite";
import AdminPage from "./pages/AdminPage";
import TestAdminFetch from "./pages/TestAdminFetch"; // <-- import your test JSX here
import TestConnection from "./pages/TestConnection";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* MAIN INVITE */}
        <Route
          path="/"
          element={
            <div
              style={{
                width: "100vw",
                height: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#fdf6e3",
              }}
            >
              <Envelope />
            </div>
          }
        />

        {/* ADMIN PAGE */}
        <Route path="/admin" element={<AdminPage />} />

<Route path="/testconnection" element={<TestConnection />} />
        {/* TEST PAGE */}
        <Route path="/test" element={<TestAdminFetch />} /> {/* <-- added route */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
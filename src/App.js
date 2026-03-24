import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Envelope from "./components/WeddingInvite";
import AdminPage from "./pages/AdminPage";

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
      </Routes>
    </BrowserRouter>
  );
}

export default App;
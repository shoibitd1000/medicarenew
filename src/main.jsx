import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { App } from "./App";
import { StrictMode } from "react";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./app/authtication/Authticate";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);

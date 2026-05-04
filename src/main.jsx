import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { ErpDataProvider } from "./context/ErpDataContext.jsx";
import "./styles.css";
import "./ledger.css";

createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <ErpDataProvider>
      <App />
    </ErpDataProvider>
  </AuthProvider>,
);

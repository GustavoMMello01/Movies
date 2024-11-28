import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import AppRoutes from "./routes/AppRoutes";
import { AuthContextProvider } from "./hooks/AuthContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthContextProvider>
      <AppRoutes />
    </AuthContextProvider>
  </React.StrictMode>
);

import React from "react";
import "./globals.css";
import Toaster from "../lib/notify";
import { Link } from "react-router-dom";

export default function RootLayout({ children }) {
  return (
    <div className="font-body antialiased">
      {/* Google Fonts */}
      <Link
        rel="preconnect"
        href="https://fonts.googleapis.com"
        rel="stylesheet"
      />
      <Link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossOrigin="anonymous"
      />
      <Link
        href="https://fonts.googleapis.com/css2?family=PT+Sans:wght@400;700&display=swap"
        rel="stylesheet"
      />

      {/* Page Content */}
      {children}

      {/* Toaster Notification */}
      <Toaster />
    </div>
  );
}

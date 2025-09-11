import React from "react";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <div className="font-body antialiased">
      {/* Google Fonts */}
      <link
        rel="preconnect"
        href="https://fonts.googleapis.com"
        rel="stylesheet"
      />
      <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossOrigin="anonymous"
      />
      <link
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

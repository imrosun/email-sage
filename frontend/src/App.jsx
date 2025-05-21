import React from "react";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";

export default function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-600 text-white py-4 shadow">
        <h1 className="text-2xl font-bold text-center">Email Sage</h1>
         <h3 className="text-2xl italic text-center">Bulk Email Scheduler</h3>
      </header>
      <main className="max-w-5xl mx-auto py-4 px-2">
        <Home />
        <div className="my-8" />
        <Dashboard />
      </main>
    </div>
  );
}

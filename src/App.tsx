import React from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/shared/Header";
import DialogStored from "./components/shared/DialogStored";
import { ToastProvider } from "./components/providers/ToastProvider";
import HomePage from "./pages/HomePage";
import Learn from "./pages/Learn";
import Developers from "./pages/Developers";
import Community from "./pages/Community";
import Showcase from "./pages/Showcase";
import DeveloperDetail from "./pages/DeveloperDetail";
import Profile from "./pages/Profile";

const App: React.FC = () => {
  return (
    <ToastProvider>
      <div className="min-h-screen bg-gray-950 text-gray-100">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/learn" element={<Learn />} />
            <Route path="/developers" element={<Developers />} />
            <Route path="/community" element={<Community />} />
            <Route path="/showcase" element={<Showcase />} />
            <Route path="/:username" element={<DeveloperDetail />} />
            <Route path="/profile/:address" element={<Profile/>} />
            <Route path="*" element={<div className="text-center">Page not found!</div>} />
          </Routes>
        </main>
        <DialogStored />
      </div>
    </ToastProvider>
  );
};

export default App;

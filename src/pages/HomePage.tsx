import React from "react";
import DeveloperBubbles from "../components/DeveloperBubbles";
import SimpleSilk from "../components/SimpleSilk";

const HomePage: React.FC = () => {
  return (
    <div className="relative flex min-h-screen items-center justify-center pt-16">
      {/* Silk Background */}
      <SimpleSilk />
      
      {/* Main Content */}
      <div className="container mx-auto px-4 py-4 z-10 relative text-center">
        <h1 className="text-4xl font-bold mb-4 text-white">
          Welcome to Dolphinder Nation
        </h1>
        <p className="text-lg text-white/95 mb-6">
          The on-chain developers showcase & connect
        </p>
      </div>
      <div className="absolute inset-0">
        <DeveloperBubbles />
      </div>
    </div>
  );
};

export default HomePage;
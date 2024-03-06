import React from "react";
import { ConnectKitButton } from "connectkit";

const ExampleButton = () => {
  return (
    <ConnectKitButton.Custom>
      {({ isConnected, show, address }) => {
        return (
          <button
            onClick={show}
            className="bg-gray-800 text-white font-bold py-2 px-4 rounded hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-600 transition-colors duration-300"
          >
            {isConnected && address
              ? `${address.slice(0, 6)}...${address.slice(-4)}`
              : "Connect"}
          </button>
        );
      }}
    </ConnectKitButton.Custom>
  );
};

const Header: React.FC = () => {
  return (
    <header className="bg-gray-900 py-4 px-6 flex justify-between items-center">
      {/* Logo */}
      <div className="text-white font-bold text-xl">My App</div>

      <ExampleButton />
    </header>
  );
};

export default Header;

import { useState } from "react";
import polygonIcon from "../assets/polygon.png";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  team1: string;
  team2: string;
  onTeam1Click: () => void;
  onTeam2Click: () => void;
}

export const PredictModal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  team1,
  team2,
  onTeam1Click,
  onTeam2Click,
}) => {
  const [amount, setAmount] = useState("");

  const handleClose = () => {
    setAmount(""); // Clear the input field
    onClose(); // Invoke the onClose prop function to close the modal
  };

  if (!isOpen) return null;

  return (
    <div className=" absolute top-1/2 bg-black bg-opacity-75 flex justify-center items-center">
      <div className="bg-gray-800 text-white p-4 rounded-lg shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Play for your team!!!!</h2>
          <button onClick={handleClose} className="text-lg font-semibold">
            X
          </button>
        </div>
        <div className="flex space-x-2 my-4">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="border p-1 rounded bg-gray-700 border-gray-600 text-white"
            placeholder="Enter amount"
          />
          <div className="flex items-center justify-center">
            <img src={polygonIcon} alt="coin icon" className="h-6 w-6" />
          </div>
        </div>
        <div className="flex justify-between pt-4">
          <button
            onClick={onTeam1Click}
            className="px-4 py-2 border rounded bg-gray-700 hover:bg-gray-600"
          >
            {team1}
          </button>
          <button
            onClick={onTeam2Click}
            className="px-4 py-2 border rounded bg-gray-700 hover:bg-gray-600"
          >
            {team2}
          </button>
        </div>
      </div>
    </div>
  );
};

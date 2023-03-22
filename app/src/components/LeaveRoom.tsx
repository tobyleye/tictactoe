import { useContext, useState } from "react";
import { Modal } from "./Modal";

export function LeaveRoom({ onLeave }: { onLeave: () => void }) {
  const [showWarning, setShowWarning] = useState(false);
  return (
    <>
      <Modal open={showWarning}>
        <div>
          <div className="text-4xl mb-2">⚠️</div>
          <p>Are you sure you want to leave?</p>
          <div className="flex items-center justify-center mt-4 gap-3">
            <button
              onClick={onLeave}
              className="border border-gray-300 text-gray-800 bg-gray-300 rounded-md px-4 py-1"
            >
              yeah
            </button>
            <button
              onClick={() => setShowWarning(false)}
              className="border border-gray-300 rounded-md px-4 py-1"
            >
              uhm, no
            </button>
          </div>
        </div>
      </Modal>
      <button className="text-red-300" onClick={() => setShowWarning(true)}>
        Leave
      </button>
    </>
  );
}

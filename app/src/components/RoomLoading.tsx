import { Player } from "@/types";
import { Modal } from "./Modal";
import { CopyButton } from "./CopyButton";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Spinner } from "./Spinner";

const Countdown = ({ onComplete }: { onComplete: () => void }) => {
  const [count, setCount] = useState(3);

  useEffect(() => {
    if (count > 0) {
      setTimeout(() => {
        setCount(count - 1);
      }, 1000);
    }
  }, [count]);

  useEffect(() => {
    if (count === 0) {
      onComplete();
    }
  }, [count, onComplete]);

  return (
    <div className="text-center">
      <div className="mb-2 text-xl">Starting in</div>
      <div className="text-2xl font-bold">{count}</div>
    </div>
  );
};

export function RoomLoading({
  player,
  loadingRoom,
  players,
  onStart,
}: {
  player: Player | null;
  players: null | any[];
  loadingRoom: boolean;
  onStart: () => void;
}) {
  const startCountdown = players && players.every((player) => player !== null);

  console.log("players:", players);
  return (
    <Modal open={true}>
      {loadingRoom ? (
        <div>
          <Spinner />
        </div>
      ) : startCountdown ? (
        <Countdown onComplete={onStart} />
      ) : player && player.isHost ? (
        <div>
          <div className="text-gray-300 mb-4">
            <p className="mb-2">Invite your friends to join you</p>
            <p>The game will auto start when they join.</p>
          </div>
          <div>
            <div className="mb-3">
              <CopyButton text={location.href} />
            </div>
            <button className="btn border border-gray-300 px-4 py-1 rounded-md">
              Share
            </button>
          </div>
        </div>
      ) : !player ? (
        <div>
          <p aria-label="sad" className="text-4xl mb-1">
            😞
          </p>
          <p className="mb-4">Room not found</p>
          <Link
            href="/"
            className="border border-gray-300 px-4 py-2 rounded-md inline-block text-center"
          >
            Create new room
          </Link>
        </div>
      ) : null}
    </Modal>
  );
}

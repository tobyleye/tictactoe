import { Player, PlayerMark } from "@/types";
import Link from "next/link";

export function GameResult({
  gameOver,
  players,
  player,
}: {
  gameOver: boolean;
  players: Player[];
  player: Player;
}) {
  if (!gameOver) return null;

  const [host, guest] = players;
  let winner;
  if (host.score === guest.score) {
    winner = null;
  } else if (host.score > guest.score) {
    winner = host;
  } else {
    winner = guest;
  }

  const playerWon = winner && winner.id === player.id;

  return (
    <div className="absolute top-0 bottom-0 right-0 z-10 left-0 bg-gray-900 grid place-items-center py-10">
      <div className=" text-center">
        {!winner ? (
          <div>
            <div className="mb-4 text-4xl font-bold">Try harder</div>
            <div className="mb-12 text-xl text-gray-300">You drew</div>
          </div>
        ) : playerWon ? (
          <div>
            <div className="mb-4 text-4xl font-bold">Congratulations</div>
            <div className="mb-12 text-xl text-gray-300">You won</div>

            <div className="flex justify-center mb-4">
              <div className="relative text-8xl font-bold">{player.mark}</div>
            </div>
            <div className="text-2xl text-green-400 mb-10">+ 5 score</div>
          </div>
        ) : (
          <div>
            <div className="mb-4 text-4xl font-bold">Better luck next time</div>
            <div className="mb-12 text-xl text-gray-300">You Lost</div>

            <div className="flex justify-center mb-4">
              <div className="relative text-8xl font-bold">{player.mark}</div>
            </div>
          </div>
        )}

        <div className="grid gap-4 mt-10">
          <Link href="/" className="button">
            New Game
          </Link>
          <Link href="/" className="button button-purple">
            Close
          </Link>
        </div>
      </div>
    </div>
  );
}

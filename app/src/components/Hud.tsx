//heads-up display

import { Player } from "@/types";
import { useSpring, animated } from "@react-spring/web";

export function Hud({
  players,
  player: self,
  nextPlayer,
  round,
}: {
  players: Player[];
  player: Player;
  nextPlayer: Player;
  round: number;
}) {
  const [host, guest] = players;

  const getDisplayName = (player: Player) => {
    if (player.id === self.id) {
      return "You";
    }
    if (player.isHost) {
      return "Host";
    }
    if (player.isHost === false) {
      return "Guest";
    }
    return "";
  };

  return (
    <div className="relative py-4">
      <div className="w-full grid grid-cols-3">
        <div>
          {host && (
            <PlayerInfo
              className="host"
              player={host}
              displayName={getDisplayName(host)}
            />
          )}
        </div>
        <div className="text-center flex flex-col justify-center">
          <div className="text-xl font-medium">Games</div>
          <div className="text-xl">{round}/5</div>
        </div>
        <div>
          {guest && (
            <PlayerInfo
              className="guest"
              player={guest}
              displayName={getDisplayName(guest)}
            />
          )}
        </div>
      </div>

      <NextPlayerIndicator nextPlayer={nextPlayer} />
    </div>
  );
}

function PlayerInfo({
  player,
  displayName,
  className,
}: {
  player: Player;
  displayName: string;
  className?: string;
}) {
  return (
    <div className={["player text-gray-300 text-center", className].join(" ")}>
      <p>{player.mark}</p>
      <p className="text-xl">{displayName}</p>
      <p className="text-xl">{player.score}</p>
    </div>
  );
}

function NextPlayerIndicator({ nextPlayer }: { nextPlayer: Player }) {
  const springs = useSpring({
    from: { x: "0%" },
    to: { x: nextPlayer.isHost ? "0%" : "200%" },
  });
  return (
    <animated.div
      className="h-2 bg-green-200 w-1/3 absolute bottom-0 left-0"
      style={{
        ...springs,
      }}
    />
  );
}

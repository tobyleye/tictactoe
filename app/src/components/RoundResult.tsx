import { Player } from "@/types";

export function RoundResult({
  result,
  player,
  onAnimationEnd,
}: {
  result: any;
  player: Player;
  onAnimationEnd?: () => void;
}) {
  const getMessage = () => {
    if (result === "draw") {
      return `Draw!`;
    } else {
      const winningMark = result[0];
      if (player.mark === winningMark) {
        return `You win`;
      } else {
        return `Player ${winningMark.toUpperCase()} wins`;
      }
    }
  };

  return (
    <div className="result grid place-items-center">
      <div className="message" onAnimationEnd={onAnimationEnd}>
        {getMessage()}
      </div>
      <style jsx>{`
        .message {
          font-size: 30px;
          animation: message 1.4s ease;
          animation-fill-mode: both;
        }

        @keyframes message {
          0% {
            transform: scale(0);
            opacity: 0;
          }
          25% {
            transform: scale(1.2);
            opacity: 1;
          }

          40%,
          75% {
            transform: scale(1);
            opacity: 1;
          }
          100% {
            transform: scale(0);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}

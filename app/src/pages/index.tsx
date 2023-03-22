import { useContext, useState } from "react";
import { PlayerMarkSelect } from "@/components/PlayerMarkSelect";
import { SocketContext } from "@/components/SocketProvider";
import { useRouter } from "next/router";
import { animated, useSpring } from "@react-spring/web";

export default function Home() {
  const [playerMark, setPlayerMark] = useState("");
  const { socket } = useContext(SocketContext);

  const router = useRouter();

  const handlePlay = () => {
    socket.emit("newGame", playerMark, (roomId: string) => {
      router.push({
        pathname: "/play/[roomId]",
        query: {
          roomId: roomId,
        },
      });
    });
  };

  const spring = useSpring({
    from: {
      scale: 0.9,
      opacity: 0,
    },
    to: {
      scale: 1,
      opacity: 1,
    },
  });

  return (
    <>
      <div className="h-full overflow-auto px-4">
        <div className="pt-[20vh] text-center px-4">
          <h1 className="text-5xl md:text-6xl font-bold mb-12">Tictactoe.</h1>
          <animated.div style={spring} className="max-w-sm w-full mx-auto">
            <PlayerMarkSelect value={playerMark} onChange={setPlayerMark} />
            <div className="mt-6">
              <button
                disabled={!playerMark}
                onClick={handlePlay}
                className="button-purple py-3 w-full"
              >
                Play
              </button>
            </div>
          </animated.div>
        </div>
      </div>
    </>
  );
}

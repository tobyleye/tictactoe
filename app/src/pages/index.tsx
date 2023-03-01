import { useContext, useState } from "react";
import { PlayerMarkSelect } from "@/components/PlayerMarkSelect";
import { AuthContext } from "@/components/AuthProvider";
import { SocketContext } from "@/components/SocketProvider";
import { useRouter } from "next/router";
import Link from "next/link";
import { Signin } from "@/components/Signin";
import { Header } from "@/components/HomeHeader";
import { MdLeaderboard } from "react-icons/md";

export default function Home() {
  const [playerMark, setPlayerMark] = useState("");
  const { socket } = useContext(SocketContext);
  const { user } = useContext(AuthContext);

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

  return (
    <>
      <div className="h-full overflow-auto px-4">
        <Header />
        <div className="pt-[20vh] text-center px-4">
          <h1 className="text-5xl md:text-6xl font-bold mb-12">Tictactoe.</h1>
          <div>
            {!user ? (
              <Signin />
            ) : (
              <div className="max-w-sm w-full mx-auto">
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
                <div className="mt-8">
                  <Link
                    href="/leaderboard"
                    className="inline-flex  text-xl items-center gap-2"
                  >
                    <MdLeaderboard />
                    <span>Leaderboard</span>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

import { FC, ReactNode, useContext, useEffect, useRef, useState } from "react";
import { SocketContext } from "./SocketProvider";
import { Hud } from "./Hud";
import { BoardWrapper } from "./Board/BoardWrapper";
import { Player, PlayerMark } from "@/types";
import { registerEvents } from "@/socketUtils";
import { RoundResult } from "./RoundResult";
import { GameResult } from "./GameResult";
import { RoomLoading } from "./RoomLoading";
import { withAuth } from "@/hocs/withAuth";
import { LeaveRoom } from "./LeaveRoom";

const emptyBoardSquares = () => Array(9).fill(undefined);

const Room: FC<{ id: string }> = ({ id }) => {
  const { socket } = useContext(SocketContext);
  const [player, setPlayer] = useState<Player | null>(null);
  const [players, setPlayers] = useState<any[] | null>(null);
  const [loadingRoom, setLoadingRoom] = useState(false);

  const [connected, setConnected] = useState(() => socket.connected);
  const [startGame, setStartGame] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [boardSquares, setBoardSquares] = useState(() => emptyBoardSquares());
  const [nextPlayer, setNextPlayer] = useState<Player | null>(null);
  const [result, setResult] = useState<null | "draw" | [PlayerMark, number[]]>(
    null
  );
  const [showRoundResult, setShowRoundResult] = useState(false);
  const [winningScenario, setWinningScenario] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [round, setRound] = useState(1);
  const [settingUp, setSettingUp] = useState(true);
  const nextRoundStateRef = useRef<any>(null);

  useEffect(() => {
    setLoadingRoom(true);
    socket.emit("joinRoom", id, (data: any) => {
      if (data) {
        const { player, players, boardSquares, round, nextPlayer } = data;
        setPlayer(player);
        setPlayers(players);
        setRound(round);
        setNextPlayer(nextPlayer);
        setBoardSquares(boardSquares);
      }
      setLoadingRoom(false);
    });

    return () => {
      socket.emit("leaveRoom", id);
    };
  }, [connected, id, socket]);

  useEffect(() => {
    const unregister = registerEvents(socket, {
      disconnect: () => {
        setConnected(false);
        socket.once("reconnect", () => {
          setConnected(true);
        });
      },
      connect: () => {
        setConnected(true);
      },
    });

    return unregister;
  }, [socket]);

  useEffect(() => {
    const unregisterSocketEvents = registerEvents(socket, {
      playerJoined: (players: any) => {
        setPlayers(players);
      },
      startGame: (nextPlayer: any) => {
        // setStartGame(true);
        setShowShare(false);
        setNextPlayer(nextPlayer);
      },
      updateBoard: (squares: any[]) => {
        setBoardSquares(squares);
      },
      nextPlayer: setNextPlayer,
      resetBoard: (squares: any[]) => {
        setBoardSquares(squares);
      },
      result: ({ result, players, nextRoundState }) => {
        setTimeout(() => {
          setPlayers(players);
          setResult(result);
          nextRoundStateRef.current = nextRoundState;
          if (result === "draw") {
            setShowRoundResult(true);
          } else {
            setWinningScenario(result[1]);
          }
        }, 200);
      },
    });

    return () => {
      unregisterSocketEvents();
    };
  }, [socket, id]);

  const [playerDisconnectInfo, setPlayerDisconnectInfo] = useState<null | {
    player: Player;
    reason: string;
  }>(null);

  useEffect(() => {
    const unregister = registerEvents(socket, {
      playerLeave: (player, reason) => {
        setPlayerDisconnectInfo({ player, reason });
      },
    });
    return unregister;
  }, [socket, id, connected]);

  const handleSquareClick = (index: number) => {
    if (nextPlayer && player && nextPlayer.mark !== player.mark) {
      return;
    }
    socket.emit("play", index);
  };

  const startNextRound = () => {
    const nextRoundState = nextRoundStateRef.current;
    if (!nextRoundState) {
      setGameOver(true);
    } else {
      const { round, nextPlayer } = nextRoundState;
      setNextPlayer(nextPlayer);
      setRound(round);
      nextRoundStateRef.current = null;
    }
    setWinningScenario(null);
    setResult(null);
    setBoardSquares(emptyBoardSquares());
    setShowRoundResult(false);
  };

  const handleLeave = () => {
    console.log("leave..");
  };

  return (
    <div className="bg-gray-900 text-gray-200 h-full overflow-auto">
      {settingUp && (
        <RoomLoading
          player={player}
          players={players}
          loadingRoom={loadingRoom}
          onStart={() => {
            setSettingUp(false);
            setStartGame(true);
          }}
        />
      )}

      {gameOver && <GameResult />}

      {startGame && (
        <div className="h-full flex flex-col ">
          <header className="flex items-center py-4 px-6 justify-end">
            <LeaveRoom onLeave={handleLeave} />
          </header>
          <div className="flex-1 grid place-items-center py-4 relative">
            <div className="absolute right-0 w-64 h-64 border border-white bg-white text-gray-800 overflow-auto">
              {JSON.stringify({
                players,
                player,
                boardSquares,
              })}
            </div>
            {showRoundResult ? (
              <RoundResult
                result={result}
                player={player as Player}
                onAnimationEnd={startNextRound}
              />
            ) : (
              <BoardWrapper
                squares={boardSquares}
                onSquareClick={handleSquareClick}
                winningScenario={winningScenario}
                onFinishDrawingWinningLine={() => {
                  setShowRoundResult(true);
                }}
              />
            )}
          </div>
          <div className="border-t-2 border-gray-600" id="footer">
            {players && player ? (
              <Hud
                round={round}
                nextPlayer={nextPlayer as Player}
                players={players as Player[]}
                player={player as Player}
              />
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
};

export default withAuth(Room);

import shortid from "shortid";
import { DisconnectReason, Server, Socket } from "socket.io";
import { PlayerMark, Player } from "./types";
import { initBoardSquares, determineResult } from "./utils";

const otherMark = (mark: PlayerMark): PlayerMark => (mark === "x" ? "o" : "x");

export const rooms = new Map<string, Room>();

export class Room {
  io: Server;
  roomId: string;
  host: null | Player;
  guest: null | Player;
  hostMark: PlayerMark;
  squares: PlayerMark[];
  nextPlayer: null | Player;
  totalRound: number;
  currentRound: number;
  prevRoundFirstPlayer: null | Player;
  gameStarted: boolean;

  constructor(io: Server, hostMark: PlayerMark, id?: string) {
    this.io = io;
    this.roomId = id ?? shortid.generate();
    this.hostMark = hostMark;
    this.host = null;
    this.guest = null;
    this.squares = initBoardSquares();
    this.nextPlayer = null;
    this.totalRound = 5;
    this.currentRound = 1;
    this.prevRoundFirstPlayer = null;
    this.gameStarted = false;

    rooms.set(this.roomId, this);
  }

  get players() {
    return [this.host, this.guest];
  }

  leave(socket: Socket) {
    console.log(`socket(${socket.id} leaving room)`);
  }

  createPlayer(
    id: string,
    mark: PlayerMark,
    score: number,
    isHost: boolean
  ): Player {
    return {
      id,
      mark,
      score,
      isHost,
    };
  }

  join(socket: Socket, cb: any) {
    let player: Player | null = null;

    // player already joined
    if (socket.rooms.has(this.roomId)) {
      return cb(null);
    }

    if (this.host === null) {
      player = this.createPlayer(socket.id, this.hostMark, 0, true);
      this.host = player;
    } else if (this.guest === null) {
      player = this.createPlayer(socket.id, otherMark(this.hostMark), 0, false);
      this.guest = player;
    }
    if (!player) {
      return cb(null);
    }

    socket.join(this.roomId);
    const players = [this.host, this.guest];
    cb({
      player: player,
      players: players,
      // for players rejoining an ongoing game
      boardSquares: this.squares,
      round: this.currentRound,
      nextPlayer: this.nextPlayer,
    });
    socket.broadcast.to(this.roomId).emit("playerJoined", players);
    if (this.host && this.guest) {
      if (!this.nextPlayer) {
        this.nextPlayer = this.host;
        this.prevRoundFirstPlayer = this.nextPlayer;
      }
      this.io.to(this.roomId).emit("startGame", this.nextPlayer);
    }

    this.setupRoomEvents(socket);
  }

  broadcast(ev: string, ...args: any[]) {
    this.io.to(this.roomId).emit(ev, ...args);
  }

  getPlayerByMark(mark: PlayerMark) {
    return this.players.find((player) => player && player.mark === mark);
  }

  getPlayerById(id: string) {
    return this.players.find((player) => player && player.id === id);
  }

  determineNextPlayer(prevPlayer: Player) {
    return prevPlayer.isHost ? this.guest : this.host;
  }

  setupRoomEvents(socket: Socket) {
    const handlePlay = (index: number) => {
      if (!this.gameStarted) {
        this.gameStarted = true;
      }
      if (!this.squares[index] && this.nextPlayer) {
        this.squares[index] = this.nextPlayer.mark;
        this.broadcast("updateBoard", this.squares);

        const result = determineResult(this.squares);

        if (result) {
          this.squares = initBoardSquares();
          if (result !== "draw") {
            const winningMark = result[0];
            const winner = this.getPlayerByMark(winningMark) as Player;
            winner.score++;
          }

          let nextRoundState;
          if (this.currentRound < this.totalRound) {
            // initialize new round
            const nextPlayer = this.determineNextPlayer(
              this.prevRoundFirstPlayer as Player
            );
            this.nextPlayer = nextPlayer;
            this.prevRoundFirstPlayer = nextPlayer;
            this.currentRound++;
            nextRoundState = {
              nextPlayer,
              board: this.squares,
              round: this.currentRound,
            };
          }
          this.broadcast("result", {
            result,
            players: this.players,
            nextRoundState,
          });
        } else {
          this.nextPlayer = this.determineNextPlayer(this.nextPlayer);
          this.broadcast("nextPlayer", this.nextPlayer);
        }
      }
    };

    const handleLeave = (reason: DisconnectReason | "self" = "self") => {
      socket.leave(this.roomId);

      let playerLeaving;
      if (this.host && this.host.id === socket.id) {
        playerLeaving = this.host;
        this.host = null;
      } else if (this.guest && this.guest.id === socket.id) {
        playerLeaving = this.guest;
        this.guest = null;
      }

      socket.broadcast
        .to(this.roomId)
        .emit("playerLeave", playerLeaving, reason);

      socket.off("play", handlePlay);
      socket.off("leaveRoom", handleLeave);
      socket.off("disconnect", handleLeave);

      // if a player leaves while the game is ongoing, delete the game
      if (this.gameStarted === true && this.roomId !== "public") {
        rooms.delete(this.roomId);
      }
    };

    socket.on("play", handlePlay);
    socket.on("leaveRoom", handleLeave);
    socket.on("disconnect", handleLeave);
  }
}

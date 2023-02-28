export type PlayerMark = "x" | "o";

export type Player = {
  mark: PlayerMark;
  score: number;
  id: string;
  isHost: boolean;
};

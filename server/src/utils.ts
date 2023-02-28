import { PlayerMark } from "./types";

const winningScenerios = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

export function determineResult(squares: PlayerMark[]) {
  for (let [a, b, c] of winningScenerios) {
    let cella = squares[a];
    let cellb = squares[b];
    let cellc = squares[c];
    if (Boolean(cella) && cella === cellb && cella === cellc) {
      return [cella, [a, b, c]] as [PlayerMark, number[]];
    }
  }

  if (squares.every((cell) => cell !== undefined)) {
    return "draw";
  }

  return;
}

export const initBoardSquares = () => {
  return Array(9).fill(undefined);
};

import { useEffect, useRef, useState } from "react";
import { Board } from "./classes/Board";
import { useSpring, animated } from "@react-spring/web";

export function BoardWrapper({
  squares,
  onSquareClick,
  winningScenario,
  onFinishDrawingWinningLine,
}: {
  squares: any[];
  onSquareClick?: (index: number) => void;
  winningScenario: null | number[];
  onFinishDrawingWinningLine?: () => void;
}) {
  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);
  const boardRef = useRef<Board | null>(null);

  const spring = useSpring({
    from: {
      opacity: 0,
    },
    to: {
      opacity: 1,
    },
  });

  const getBoard = (cb: (board: Board) => any) => {
    const board = boardRef.current;
    if (!board) {
      return;
    }
    return cb(board);
  };

  useEffect(() => {
    if (canvas) {
      boardRef.current = new Board(canvas);
      return () => {
        boardRef.current?.destroyEvents();
      };
    }
  }, [canvas]);

  useEffect(() => {
    const cleanup = getBoard((board) => {
      board.on("click", (index: number) => {
        onSquareClick?.(index);
      });
      return () => {
        board.off("click");
      };
    });

    return cleanup;
  }, [onSquareClick, canvas]);

  useEffect(() => {
    if (winningScenario && winningScenario.length === 3) {
      const cleanup = getBoard((board) => {
        board.emit("drawWinningLine", winningScenario, () => {
          // done drawing
          setTimeout(() => {
            onFinishDrawingWinningLine?.();
          }, 600);
        });
      });
      return cleanup;
    }
  }, [winningScenario, onFinishDrawingWinningLine, canvas]);

  useEffect(() => {
    getBoard((board) => {
      board.emit("updateSquares", squares);
    });
  }, [squares, canvas]);

  return (
    <animated.div style={spring}>
      <canvas ref={(node) => setCanvas(node)} id="board"></canvas>
    </animated.div>
  );
}

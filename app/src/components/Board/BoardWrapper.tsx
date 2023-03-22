import { useEffect, useState } from "react";
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
  const [board, setBoard] = useState<Board | null>(null);

  const spring = useSpring({
    from: {
      opacity: 0,
    },
    to: {
      opacity: 1,
    },
  });

  useEffect(() => {
    if (canvas) {
      const board = new Board(canvas);
      setBoard(board);
      return () => {
        board.destroyEvents();
      };
    }
  }, [canvas]);

  useEffect(() => {
    if (!board) return;
    board.on("click", (index: number) => {
      onSquareClick?.(index);
    });

    return () => {
      board.off("click");
    };
  }, [onSquareClick, board]);

  useEffect(() => {
    if (!board) return;

    if (winningScenario && winningScenario.length === 3) {
      board.drawLine(winningScenario, () => {
        // done drawing
        setTimeout(() => {
          onFinishDrawingWinningLine?.();
        }, 600);
      });
    }
  }, [winningScenario, onFinishDrawingWinningLine, board]);

  useEffect(() => {
    if (!board) return;

    board.updateSquareLabels(squares);
  }, [squares, board]);

  return (
    <animated.div style={spring}>
      <canvas ref={(node) => setCanvas(node)} id="board"></canvas>
    </animated.div>
  );
}

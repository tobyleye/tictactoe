import { EventEmitter } from "./EventEmitter";

const rows = 3;
const cols = 3;
const gapx = 2;
const gapy = 2;

const totalRowGaps = gapx * (rows - 1);
const totalColGaps = gapy * (cols - 1);

type Square = {
  x: number;
  y: number;
  top: number;
  bottom: number;
  left: number;
  right: number;
  width: number;
  height: number;
  label?: string;
};

type Point = [number | null, number | null];

type BoardEvents = {
  click: (index: number) => void;
};

const BOARD_MAX_SIZE = 440;

export class Board extends EventEmitter {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  squares: Square[];
  squareLabels: string[];
  mousePos: { x: null | number; y: null | number };
  nextPlayer: string;
  disabled: boolean;

  constructor(canvas: HTMLCanvasElement) {
    super();
    console.log({ pixelRatio: window.devicePixelRatio });
    this.squares = [];
    this.squareLabels = [];
    this.mousePos = {
      x: null,
      y: null,
    };
    this.nextPlayer = "x";
    this.disabled = false;
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
    this.setCanvasSize();
    this.createSquares();
    this.draw();
    this.initListeners();
  }

  mount(canvas: HTMLCanvasElement) {}

  setCanvasSize() {
    const windowWidth = window.innerWidth - 40;
    const size = Math.min(windowWidth, BOARD_MAX_SIZE);
    this.canvas.width = size;
    this.canvas.height = size;
  }

  handleResize = () => {
    this.setCanvasSize();
    this.createSquares();
    this.draw();
  };

  initListeners() {
    window.addEventListener("resize", this.handleResize);
    this.canvas.addEventListener("mousemove", this.handleHover);
    this.canvas.addEventListener("mouseenter", this.handleHover);
    this.canvas.addEventListener("click", this.handleClick);
    this.canvas.addEventListener("mouseout", this.handleMouseOut);

    this.on("updateSquares", this.updateSquareLabels.bind(this));
    this.on("drawWinningLine", this.drawLine.bind(this));
  }

  destroyEvents = () => {
    this.canvas.removeEventListener("mousemove", this.handleHover);
    this.canvas.removeEventListener("mouseenter", this.handleHover);
    this.canvas.removeEventListener("click", this.handleClick);
    this.canvas.removeEventListener("mouseout", this.handleMouseOut);
    window.removeEventListener("resize", this.handleResize);
  };

  handleMouseOut = () => {
    this.mousePos = { x: null, y: null };
    this.draw();
  };

  handleHover = (evt: MouseEvent) => {
    if (!this.disabled) {
      this.mousePos = this.getMousePos(evt);
      this.draw();
    }
  };

  randomMark() {
    let random = Math.random();
    return random > 0.5 ? "X" : "O";
  }

  updateSquareLabels(labels: string[]) {
    this.squareLabels = labels;
    this.draw();
  }

  setNextPlayer() {
    this.nextPlayer = this.nextPlayer === "x" ? "o" : "x";
  }

  getMousePos = (evt: MouseEvent) => {
    if (!this.canvas) return { x: null, y: null };
    var rect = this.canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top,
    };
  };

  handleClick = (evt: MouseEvent) => {
    const { x, y } = this.getMousePos(evt);

    const getSquareIndexClicked = () => {
      for (let i = 0; i < this.squares.length; i++) {
        const square = this.squares[i];
        if (!square.label && this.intersect(square, [x, y])) {
          return i;
        }
      }
    };

    const clickedSquare = getSquareIndexClicked();
    if (clickedSquare !== undefined) {
      this.emit("click", clickedSquare);
    }
  };

  createSquares() {
    this.squares = [];
    let squareWidth = (this.canvas.width - totalRowGaps) / rows;
    let squareHeight = (this.canvas.height - totalColGaps) / cols;

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        let x1 = col * squareWidth + gapy * col;
        let y1 = row * squareHeight + gapx * row;
        let x2 = x1 + squareWidth;
        let y2 = y1 + squareHeight;
        let square = {
          x: x1,
          y: y1,
          top: y1,
          bottom: y2,
          left: x1,
          right: x2,
          width: squareWidth,
          height: squareHeight,
          label: undefined,
        };
        this.squares.push(square);
      }
    }
  }

  intersect(square: Square, point: Point) {
    if (point[0] === null || point[1] === null) {
      return false;
    }
    const { left, top, right, bottom } = square;

    return (
      left <= point[0] &&
      right >= point[0] &&
      top <= point[1] &&
      bottom >= point[1]
    );
  }

  centerPoint(square: Square) {
    return [(square.left + square.right) / 2, (square.top + square.bottom) / 2];
  }

  drawLine(winningIndexes: number[], onComplete: () => void) {
    this.disabled = true;

    const [a, _, c] = winningIndexes;

    const fromSquare = this.squares[a];
    const toSquare = this.squares[c];

    let [x1, y1] = this.centerPoint(fromSquare);
    let [x2, y2] = this.centerPoint(toSquare);

    this.ctx.moveTo(x1, y1);

    const speed = 8;

    const updatePosition = (
      pos: number,
      destination: number,
      speed: number
    ) => {
      const reverse = pos > destination;
      if (reverse) {
        let newPos = pos - speed;
        if (newPos < destination) {
          return destination;
        }
        return newPos;
      } else {
        let newPos = pos + speed;
        if (newPos > destination) {
          return destination;
        }
        return newPos;
      }
    };

    this.ctx.strokeStyle = "white";
    this.ctx.lineWidth = 5;
    this.ctx.beginPath();

    const draw = () => {
      this.ctx.lineTo(x1, y1);
      this.ctx.stroke();
      if (x1 === x2 && y1 === y2) {
        // stop
        onComplete?.();
      } else {
        x1 = updatePosition(x1, x2, speed);
        y1 = updatePosition(y1, y2, speed);
        window.requestAnimationFrame(draw);
      }
    };
    window.requestAnimationFrame(draw);
  }

  drawSquares() {
    for (let i = 0; i < this.squares.length; i++) {
      const square = this.squares[i];
      this.ctx.lineWidth = 1;
      const hovered = this.intersect(square, [
        this.mousePos.x,
        this.mousePos.y,
      ]);
      if (hovered) {
        this.ctx.fillStyle = "gray";
      } else {
        this.ctx.fillStyle = "rgb(31 41 55)";
      }

      this.ctx.fillRect(square.x, square.y, square.width, square.height);
      this.ctx.font = "50px Arial";
      this.ctx.fillStyle = "white";
      this.ctx.textAlign = "center";
      this.ctx.textBaseline = "middle";
      this.ctx.fillText(
        this.squareLabels[i] ?? square.label ?? "",
        square.x + square.width / 2,
        square.y + square.height / 2
      );
    }
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawSquares();
  }
}

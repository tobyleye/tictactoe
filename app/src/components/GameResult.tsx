export function GameResult() {
  return (
    <div className="absolute top-0 bottom-0 right-0 z-10 left-0 bg-gray-900 grid place-items-center">
      <div className=" text-center marker:">
        <div className="mb-8 text-4xl font-bold">Game Over</div>
        <div className="text-2xl text-gray-300 mb-6">Player X wins</div>
        <button>Restart</button>
      </div>
    </div>
  );
}

import Link from "next/link";
import { useEffect, useState } from "react";

const getLeaderboard = async () => {
  const resp = await fetch("http://localhost:5201/leaderboard");
  if (!resp.ok) {
    throw new Error(`fetch error ${resp.status}`);
  }
  const data = await resp.json();
  return data;
};

const formatNum = (num: number) => {
  return num.toLocaleString();
};

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState<any[]>([]);

  useEffect(() => {
    getLeaderboard()
      .then((data) => {
        setLeaderboard(data);
      })
      .catch((err) => {
        console.log("error:", err);
      });
  }, []);

  const renderList = () => {
    let list = [];
    for (let i = 0; i < 10; i++) {
      let player = leaderboard[i];
      list.push(
        <li key={`leaderboard-${i}`}>
          <div className="flex items-end">
            <span className="mr-2  w-10">{i + 1}.</span>
            <div className="mr-5">
              <div className="capitalize">
                {player ? player.name : `_ _ _   _ _ _ _`}
              </div>
            </div>
            <div className="ml-auto">
              {player ? formatNum(player.score) : `_ _`}
            </div>
          </div>
        </li>
      );
    }
    return list;
  };

  return (
    <div className="h-full overflow-auto">
      <div className="max-w-md mx-auto pt-20 px-8">
        <div className="mb-4">
          <Link href="/" className="text-xl">
            Back
          </Link>
        </div>
        <h3 className="text-3xl mb-8 font-bold text-center">Leaderboard</h3>
        <div className="">
          {leaderboard.length > 0 ? (
            <ol className="grid gap-4">{renderList()}</ol>
          ) : (
            <div className="text-center">loading..</div>
          )}
        </div>
      </div>
    </div>
  );
}

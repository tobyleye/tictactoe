import Link from "next/link";
import { useEffect, useState } from "react";
import { getLeaderboard } from "@/api";
import { Spinner } from "@/components/Spinner";
import { MdLeaderboard } from "react-icons/md";
import { useSpring, animated } from "@react-spring/web";
import { BiArrowBack } from "react-icons/bi";

const formatNum = (num: number) => {
  return num.toLocaleString();
};

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const slideSpring = useSpring({
    from: {
      y: "100%",
    },
    to: {
      y: "0%",
    },
    delay: 80,
  });
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
      <div className="max-w-md mx-auto pt-10  md:pt-20 px-4">
        <div className="mb-4">
          <Link href="/">
            <BiArrowBack className="text-3xl" />
          </Link>
        </div>
        <h3 className="text-3xl leading-[40px] mb-8 font-bold text-center flex justify-center items-center gap-2 ">
          <div className="overflow-hidden">
            <animated.div style={slideSpring}>
              <MdLeaderboard />
            </animated.div>
          </div>
          Leaderboard
        </h3>
        <div className="">
          {leaderboard.length > 0 ? (
            <ol className="grid gap-4">{renderList()}</ol>
          ) : (
            <div className="text-center py-4">
              <Spinner />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// 2 minutes 10 seconds

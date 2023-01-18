import { Inter } from "@next/font/google";

const inter = Inter({ subsets: ["latin"] });
import { io } from "socket.io-client";
import { useEffect } from "react";

const socket = io("http://localhost:5001");

console.log("socket:", socket);

export default function Home() {
  useEffect(() => {
    socket.on("connect", () => {
      console.log("socket connected");
    });
    socket.on("greet", () => {
      console.log("greetings");
    });
  }, []);

  const greet = () => {
    socket.emit("greet");
  };

  return (
    <>
      <main>
        <h1>Hello world</h1>

        <button onClick={greet}>hello</button>
      </main>
    </>
  );
}

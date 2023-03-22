import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import SocketProvider from "@/components/SocketProvider";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

const useRouterReady = () => {
  const [ready, setReady] = useState(false);
  const router = useRouter();
  useEffect(() => {
    setReady(router.isReady);
  }, [router.isReady]);
  return ready;
};

export default function App({ Component, pageProps }: AppProps) {
  const ready = useRouterReady();

  return (
    <>
      <Head>
        <title>Tictactoe</title>
        <meta name="tictactoe" content="Play tictactoe with friends" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <SocketProvider>
        <div className="absolute top-0 left-0 bottom-0 right-0 overflow-auto bg-gray-900 text-gray-200">
          {ready ? <Component {...pageProps} /> : null}
        </div>
      </SocketProvider>
    </>
  );
}

import "@/styles/globals.css";
import type { AppProps } from "next/app";

import "./reactCOIServiceWorker";

export default function App({ Component, pageProps }: AppProps) {
  console.log("test1239");
  return <Component {...pageProps} />;
}

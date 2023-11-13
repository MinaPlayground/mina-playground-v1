import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Provider } from "react-redux";
import { store } from "@/store";
import "@/styles/editor.css";
import "xterm/css/xterm.css";
import "@code-hike/mdx/dist/index.css";
import { MDXProvider } from "@mdx-js/react";
import TutorialHeader from "@/components/tutorial/TutorialHeader";
import TutorialText from "@/components/tutorial/TutorialText";
import TutorialHighlightedText from "@/components/tutorial/TutorialHighlightedText";
import { Components } from "@mdx-js/react/lib";
import NextNProgress from "nextjs-progressbar";
import { useRouter } from "next/router";
import TutorialList from "@/components/tutorial/TutorialList";
import TutorialSectionHeader from "@/components/tutorial/TutorialSectionHeader";
import TutorialOrderedList from "@/components/tutorial/TutorialOrderedList";
import RunHeader from "@/components/tutorial/RunHeader";
import { GoogleAnalytics } from "nextjs-google-analytics";

const components: Components = {
  h1: TutorialHeader,
  h2: TutorialSectionHeader,
  h3: RunHeader,
  p: TutorialText,
  ul: TutorialList,
  ol: TutorialOrderedList,
  strong: TutorialHighlightedText,
};

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  return (
    <>
      <GoogleAnalytics trackPageViews />
      <MDXProvider components={components}>
        <Provider store={store}>
          <NextNProgress
            startPosition={0.3}
            stopDelayMs={200}
            height={3}
            showOnShallow={true}
          />
          <Component key={router.asPath} {...pageProps} />
        </Provider>
      </MDXProvider>
    </>
  );
}

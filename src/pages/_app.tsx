import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Provider } from "react-redux";
import { store } from "@/store";
import "@/styles/editor.scss";
import "xterm/css/xterm.css";
import "@code-hike/mdx/dist/index.css";
import { MDXProvider } from "@mdx-js/react";
import TutorialHeader from "@/components/tutorial/TutorialHeader";
import TutorialText from "@/components/tutorial/TutorialText";
import TutorialHighlightedText from "@/components/tutorial/TutorialHighlightedText";
import { Components } from "@mdx-js/react/lib";

const components: Components = {
  h1: TutorialHeader,
  p: TutorialText,
  strong: TutorialHighlightedText,
};

export default function App({ Component, pageProps }: AppProps) {
  return (
    <MDXProvider components={components}>
      <Provider store={store}>
        <Component {...pageProps} />
      </Provider>
    </MDXProvider>
  );
}

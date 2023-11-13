import Document, { Html, Head, Main, NextScript } from "next/document";
import Script from "next/script";

export default class _Document extends Document {
  render() {
    return (
      <Html>
        <Head />
        <body>
          <Main />
          <NextScript />
          {process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS ? (
            <>
              <Script
                src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}`}
              />
              <Script id="google-analytics">
                {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
 
          gtag('config', ${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS});
        `}
              </Script>
            </>
          ) : null}
        </body>
      </Html>
    );
  }
}

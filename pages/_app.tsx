import "@/styles/globals.scss";
import "@/styles/custom-themes.scss";
import "@/styles/markdown-theme.scss";

import type { AppProps } from "next/app";
import Head from "next/head";
import { useRouter } from "next/router";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  return (
    <>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin={""}
        />
        <link
          href="https://fonts.googleapis.com/css2?family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inconsolata:wght@200..900&display=swap"
          rel="stylesheet"
        />

        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
        />
      </Head>
      <div className="bg-gray-100 w-full h-16">
        <div className="flex h-full c-center justify-between items-center">
          <p
            className="cursor-pointer font-semibold text-stone-700"
            onClick={() => router.push("/")}
          >
            LPL
          </p>

          <a
            onClick={() => router.back()}
            className="text-blue-300 cursor-pointer animate-pulse"
          >
            Go back
          </a>
        </div>
      </div>
      <Component {...pageProps} />;
      <footer className="bg-gray-100 w-full h-16 fixed bottom-0 font-main text-[0.95rem] md:text-[1.05rem]">
        <div className="flex h-full c-center justify-between items-center">
          <p className="cursor-pointer text-stone-500">Contact me:</p>
          <a
            href="https://www.linkedin.com/in/phuclamle/"
            className="text-stone-500 cursor-pointer animate-bounce"
          >
            Linkedin
          </a>
          <a
            href="https://www.facebook.com/phuclam534"
            className="text-blue-300 cursor-pointer animate-pulse"
          >
            Facebook
          </a>
        </div>
      </footer>
    </>
  );
}

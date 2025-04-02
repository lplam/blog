import Head from "next/head";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();
  return (
    <>
      <Head>
        <meta
          name="google-site-verification"
          content="7zD-IcrB0mbqtTCBKAqcD2Lvv2HK7scFYNaM2F8JnHs"
        />
      </Head>
      <main className={`custom-themes c-center items-center justify-between`}>
        <div className="h-[4rem] md:h-[9rem]"></div>
        <h1>Hello, I&apos;m Lam</h1>
        <p>
          I&apos;m{" "}
          <span className="text-blue-500 animate-pulse">Software Engineer</span>
        </p>
        <p>
          {"Thank you for your visit my site "}
          <span className="animate-ping">.</span>
          <span className="animate-ping">.</span>
          <span className="animate-ping">.</span>
        </p>
        <br></br>
        <div className="grid grid-cols-2 gap-2">
          <div
            onClick={() => router.push("/portfolio")}
            className="col-span-1 w-full h-12 flex items-center justify-center bg-red-50 rounded-lg cursor-pointer animate-pulse font-semibold"
          >
            My portfolio
          </div>
          <div
            onClick={() => router.push("/blog")}
            className="col-span-1 w-full h-12 flex items-center justify-center bg-green-200 rounded-lg cursor-pointer animate-pulse font-semibold"
          >
            My Blog
          </div>
        </div>
      </main>
    </>
  );
}

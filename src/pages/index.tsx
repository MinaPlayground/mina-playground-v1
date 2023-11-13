import Head from "next/head";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ReadMoreSection from "@/components/ReadMoreSection";
import Footer from "@/components/Footer";

const Home = () => {
  return (
    <>
      <Head>
        <title>Mina Playground</title>
        <meta
          name="description"
          content="All-in-One Platform for Mina Protocol, with Mina Playground you can create, test and run zkApps/Smart Contracts, deploy your own Smart Contracts and follow interactive tutorials."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/icon.svg" />
      </Head>
      <div>
        <Header />
        <HeroSection />
        <ReadMoreSection />
        <Footer />
      </div>
    </>
  );
};

export default Home;

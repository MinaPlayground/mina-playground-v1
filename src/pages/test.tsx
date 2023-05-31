import Head from "next/head";
import styles from "@/styles/Home.module.css";
import type { GetServerSideProps } from "next";
import path from "path";
import fs from "fs/promises";

export const getServerSideProps: GetServerSideProps = async ({
  query,
  req,
}) => {
  const { s } = query;
  const dir = process.cwd();
  const fileContents = await fs.readFile(
    `${dir}/tutorials/01-introduction/${s}` + "/meta.json",
    "utf8"
  );
  return {
    props: {},
  };
};

const Home = () => {
  return (
    <>
      <Head>
        <title>Mina Playground</title>
        <meta
          name="description"
          content="Interactive Smart Contracts tutorial"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/icon.svg" />
      </Head>
      <main className={styles.main}></main>
    </>
  );
};

export default Home;

import type { NextPage } from "next";
import Head from "next/head";
import { Navbar } from "../components/Navbar"
import { Protected } from "../components/Protected";
import { MyTodoList } from "../components/TodoList";


const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>miniminitodo</title>
        <meta name="description" content="tododo" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Navbar />
        <Protected>
          <MyTodoList />
        </Protected>
      </main>
    </>
  );
};

export default Home;

import type { NextPage } from "next";
import Head from "next/head";
import { Navbar } from "../components/Navbar"
import { TimeLine } from "../components/Timeline";
import { GlobalTask } from "../components/GlobalTask";


const Global: NextPage = () => {
    return (
        <>
            <Head>
                <title>miniminitodo|timeline</title>
                <meta name="description" content="tododo" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main>
                <Navbar />
                <div className="flex p-4 shadow bg-slate-300 space-x-2 min-h-full">
                    <GlobalTask />
                    <TimeLine />
                </div>
            </main>
        </>
    );
};

export default Global;

import { trpc } from "../utils/trpc";
import { signIn, signOut, useSession } from "next-auth/react";

export const Navbar = () => {
    const { data: session } = useSession();
    const isLoggedIn = !!session

    return (
        <div className="shadow">
            <div className="flex mx-4 px-6 py-3 justify-between">
                {isLoggedIn ?
                    <Logout /> :
                    <Login />
                }
            </div>
        </div>
    )
}
const Login = () => {
    return (
        <>
            <div></div>
            <button className="pb-0 pt-1 px-4 bg-gray-200 rounded-md h-10" onClick={() => signIn()}>ログイン</button>
        </>
    )
}

const Logout = () => {
    const { data: session } = useSession();

    const imageUrl = session?.user?.image ?? undefined

    return (
        <>
            <img src={imageUrl} className="w-10 h-10 rounded-full" />
            <button className="pb-0 pt-1 px-4 bg-gray-200 rounded-md" onClick={() => signOut()}>ログアウト</button>
        </ >
    )
}

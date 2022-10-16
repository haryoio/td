import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { ProfileImage } from "./atoms/ProfileImage";

export const Navbar = () => {
    const { data: session } = useSession();
    const isLoggedIn = !!session

    return (
        <div className="shadow">
            <div className="flex mx-4 px-6 py-3 justify-between">
                <div>
                    <button className="ml-5 mx-2 py-2 px-4 border-r-4 font-black"><Link href="/">自分のタスク</Link></button>
                    <button className="mx-2 py-2 font-black"><Link href="/timeline">みんなのタスク</Link></button>
                </div>
                <div>
                    {isLoggedIn ?
                        <Logout /> :
                        <Login />
                    }
                </div>
            </div>
        </div>
    )
}
const Login = () => {
    return (
        <div className="flex ">
            <div></div>
            <button className="pb-0 pt-1 px-4 bg-gray-200 rounded-md h-10" onClick={() => signIn()}>ログイン</button>
        </div>
    )
}

const Logout = () => {
    const { data: session } = useSession();

    const imageUrl = session?.user?.image ?? ""

    return (
        <div className="flex justify-end space-x-2">
            <ProfileImage src={imageUrl} />
            <button className="pb-0 pt-1 px-4 bg-gray-200 rounded-md" onClick={() => signOut()}>ログアウト</button>
        </div>
    )
}

import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";

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

    const imageUrl = session?.user?.image ?? ""

    return (
        <>
            <div className="h-10 w-10 relative">
                <Image src={imageUrl} width={"10"} height={"10"} alt="profile" layout={'responsive'} className="rounded-full " />
            </div>
            <button className="pb-0 pt-1 px-4 bg-gray-200 rounded-md" onClick={() => signOut()}>ログアウト</button>
        </ >
    )
}

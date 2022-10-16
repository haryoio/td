import { useSession } from "next-auth/react";
import { Children } from "react";

export const Protected = ({ children }: { children: JSX.Element }): JSX.Element => {
    const { data: session } = useSession();
    const isLoggedIn = !!session

    if (!isLoggedIn) return <></>

    return <>{children}</>
}

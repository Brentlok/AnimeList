/* eslint-disable @next/next/no-img-element */
import { useSession } from "next-auth/react";

export const Nav = () => {
    const { data: session } = useSession();

    const user = session?.user ? (
        <div className="flex items-center gap-2">
            <span className="text-gray-700">{session.user.name}</span>
            <img className="w-12 h-12 rounded-full" src={session.user.image ?? ''} alt='' />
        </div>
    ) : null;

    return (
        <nav className="w-full h-16 bg-gray-300 fixed p-2 items-center justify-between flex">
            <h1 className="text-2xl font-extrabold text-gray-700">
              Anime<span className="text-red-500">List</span>
            </h1>
            {user}
        </nav>
    )
}
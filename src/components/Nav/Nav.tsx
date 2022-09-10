/* eslint-disable @next/next/no-img-element */
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import { If } from "~/bits";

export const Nav = () => {
    const { data: session } = useSession();
    const [isOpened, setIsOpened] = useState(false);

    return (
        <nav className="w-full h-16 bg-gray-300 fixed items-center justify-between flex">
            <h1 className="text-2xl font-extrabold text-gray-700 ml-2">
              Anime<span className="text-red-500">List</span>
            </h1>
            <If condition={() => Boolean(session?.user)}>
                <div 
                    className={`px-2 flex items-center gap-2 relative cursor-pointer ${isOpened ? 'bg-red-500 h-40' : ''}`}
                    onClick={() => setIsOpened(state => !state)}
                >
                    <span className="text-gray-700">{session?.user?.name}</span>
                    <img className="w-12 h-12 rounded-full" src={session?.user?.image ?? ''} alt='' />
                    <If condition={() => isOpened}>
                        <div
                            className="cursor-pointer absolute right-0 top-28 text-center w-full text-white"
                        >
                            <Link href='/admin'>
                                Admin panel
                            </Link>
                        </div>
                    </If>
                </div>
            </If>
        </nav>
    )
}
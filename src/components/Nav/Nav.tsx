import Link from "next/link"

export const Nav = () => {
    return (
        <nav className="w-full h-16 bg-gray-300 fixed items-center justify-between flex">
            <Link href='/'>
                <h1 className="text-2xl font-extrabold text-gray-700 ml-2 cursor-pointer">
                    Anime<span className="text-red-500">List</span>
                </h1>
            </Link>
        </nav>
    )
}
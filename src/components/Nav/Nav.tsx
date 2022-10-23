import { signIn, signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { confirmPrompt } from '~/utils';

export const Nav = () => {
    const { data: session } = useSession();

    const rightContent = session?.user
        ? (
            <div
                className='px-4 py-2 flex items-center gap-4 cursor-pointer hover:bg-red-500'
                onClick={() => confirmPrompt(signOut, 'Do you want to log out from the page?')}
            >
                {session.user.name}
                <div className='rounded-full'>
                    <Image
                        className='rounded-full overflow-hidden'
                        src={session.user.image ?? ''}
                        alt=''
                        width={45}
                        height={45}
                    />
                </div>
            </div>
        )
        : (
            <div
                onClick={() => signIn()}
                className='p-4 cursor-pointer text-gray-700 hover:text-red-500 font-bold transition-all'
            >
                <h1>Log in</h1>
            </div>
        )

    return (
        <nav className="w-full h-16 bg-gray-300 fixed items-center justify-between flex z-10">
            <Link href="/">
                <h1 className="text-2xl font-extrabold text-gray-700 ml-2 cursor-pointer">
                    Anime<span className="text-red-500">List</span>
                </h1>
            </Link>
            {rightContent}
        </nav>
    );
};

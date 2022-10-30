import { useAtom } from 'jotai';
import { signIn, signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { If } from '~/bits';
import { profileAtom } from '~/state';
import { confirmPrompt } from '~/utils';

export const Nav = () => {
    const { data: session, status } = useSession();
    const [profile, setProfile] = useAtom(profileAtom);
    const router = useRouter();
    const [isOpened, setIsOpened] = useState(false);

    useEffect(() => {
        if (!session?.user) {
            return;
        }

        setProfile({ name: session.user.name ?? '' });
    }, [session?.user, setProfile]);

    const rightContent = session?.user
        ? (
            <div
                className='px-4 py-2 flex items-center gap-4 cursor-pointer hover:bg-red-500 hover:text-white relative'
                onMouseEnter={() => setIsOpened(true)}
                onMouseLeave={() => setIsOpened(false)}
            >
                {profile.name}
                <div className='rounded-full'>
                    <Image
                        className='rounded-full overflow-hidden'
                        src={session.user.image ?? ''}
                        alt=''
                        width={45}
                        height={45}
                    />
                </div>
                <If condition={() => isOpened}>
                    <ul className='absolute top-16 p-4 left-0 bg-red-500 text-white w-full flex flex-col gap-2'>
                        <li
                            className='hover:font-bold'
                            onClick={() => router.push('/profile')}
                        >My account</li>
                        <If condition={() => Boolean(session?.user?.isAdmin)}>
                            <li
                                className='hover:font-bold'
                                onClick={() => router.push('/admin')}
                            >
                                Admin panel
                            </li>
                        </If>
                        <li
                            className='hover:font-bold'
                            onClick={() => confirmPrompt(signOut)}
                        >
                            Sign out
                        </li>
                    </ul>
                </If>
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
        <nav className="w-full h-16 bg-gray-300 fixed items-center justify-between flex z-50">
            <Link href="/">
                <h1 className="text-2xl font-extrabold text-gray-700 ml-2 cursor-pointer">
                    Anime<span className="text-red-500">List</span>
                </h1>
            </Link>
            {status !== 'loading' && rightContent}
        </nav>
    );
};

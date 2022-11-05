import { useAtom } from 'jotai';
import { signIn, signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { profileAtom } from '~/state';
import { confirmPrompt, fromExternalImg } from '~/utils';
import { Profile } from './Profile';

export const Nav = () => {
    const { data: session, status } = useSession();
    const [profile, setProfile] = useAtom(profileAtom);
    const router = useRouter();
    const [isOpened, setIsOpened] = useState(false);

    useEffect(() => {
        if (!session?.user) {
            return;
        }

        const { user } = session;

        const avatar = fromExternalImg(user.image);

        setProfile({
            isAdmin: user.isAdmin,
            name: user.name ?? '',
            avatar,
        });
    }, [session, setProfile]);

    const list = [
        {
            name: 'My Account',
            action: () => router.push('/profile'),
        },
        {
            forAdmin: true,
            name: 'Admin Panel',
            action: () => router.push('/admin'),
        },
        {
            name: 'Sign Out',
            action: () => confirmPrompt(signOut),
        }
    ].filter(item => profile.isAdmin ? true : !item.forAdmin);

    const rightContent = session?.user
        ? (
            <Profile
                isOpened={isOpened}
                setIsOpened={setIsOpened}
                list={list}
                avatar={profile.avatar}
                profileName={profile.name}
            />
        )
        : (
            <div
                onClick={() => signIn()}
                className='p-4 cursor-pointer text-gray-700 hover:text-red-500 font-bold transition-all'
            >
                <h1>Log in</h1>
            </div>
        );

    const content = status !== 'loading'
        ? rightContent
        : (
            <div className='px-4'>
                <Image
                    src='/ball-triangle.svg'
                    alt=""
                    width={45}
                    height={45}
                />
            </div>
        )

    return (
        <nav className="w-full h-16 bg-gray-300 fixed items-center justify-between flex z-50">
            <Link href="/">
                <h1 className="text-2xl font-extrabold text-gray-700 ml-2 cursor-pointer">
                    Anime<span className="text-red-500">List</span>
                </h1>
            </Link>
            {content}
        </nav>
    );
};

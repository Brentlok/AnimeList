import { useAtom } from "jotai";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useState } from "react";
import { Button, GoBack, Input } from "~/bits";
import { profileAtom } from "~/state";
import { preventDefault, trpc } from "~/utils";

const Profile = () => {
    const { status } = useSession();
    const [profile, setProfile] = useAtom(profileAtom);
    const [avatar, setAvatar] = useState(profile.avatar);
    const [name, setName] = useState(profile.name);
    const changeName = trpc.useMutation(['profile.changeName']);

    if (status === 'unauthenticated') {
        return <h1>Login to view your profile</h1>;
    }

    const handleSubmit = async () => {
        if (profile.name === name) {
            return;
        }

        await changeName.mutateAsync({ name });
        setProfile({ ...profile, name });
    }

    const img = avatar === ''
        ? (
            <div className="w-24 h-24">
                <Input.File setDataUrl={setAvatar} />
            </div>
        )
        : (
            <Image
                className='rounded-full overflow-hidden'
                src={avatar}
                alt=''
                width={96}
                height={96}
            />
        );

    return (
        <div className="anime flex flex-col">
            <div className="p-4 flex gap-4 items-center">
                <div className="relative">
                    <div
                        className="absolute -right-2 -top-2 cursor-pointer"
                        onClick={() => setAvatar('')}
                    >
                        <div className="close scale-50 w-5 h-5" />
                    </div>
                    {img}
                </div>
                <form onSubmit={preventDefault(handleSubmit)}>
                    <h3 className="mb-1">User name</h3>
                    <Input.Text
                        value={name}
                        onChange={setName}
                        placeholder='User name...'
                    />
                </form>
            </div>

            <Button
                type="submit"
                buttonText="Submit"
                buttonAction={handleSubmit}
                isLoading={changeName.isLoading}
            />

            <GoBack />
        </div>
    );
};

export default Profile;
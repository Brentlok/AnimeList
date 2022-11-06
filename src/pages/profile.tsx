import { useAtom } from "jotai";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Button, GoBack, Input, Loading } from "~/bits";
import { profileAtom } from "~/state";
import { preventDefault, trpc } from "~/utils";

const Profile = () => {
    const { data: session } = useSession();
    const [profile, setProfile] = useAtom(profileAtom);
    const [name, setName] = useState(profile.name);
    const changeName = trpc.useMutation(['profile.changeName']);

    useEffect(() => {
        if (profile.name === '') {
            return;
        }

        setName(profile.name);
    }, [profile.name]);

    if (!profile.initialized) {
        return <Loading />;
    }

    if (!session?.user) {
        return <h1>Login to view your profile</h1>;
    }

    const handleSubmit = async () => {
        if (profile.name === name) {
            return;
        }

        await changeName.mutateAsync({ name });
        setProfile({ ...profile, name });
    }

    return (
        <div className="anime flex flex-col">
            <div className="p-4 flex gap-4 items-center">
                <Image
                    className='rounded-full overflow-hidden'
                    src={profile.avatar}
                    alt=''
                    width={100}
                    height={100}
                />
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
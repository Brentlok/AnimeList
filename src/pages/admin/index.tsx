import { useAtom } from "jotai";
import { useRouter } from "next/router";
import { GoBack } from "~/bits";
import { profileAtom } from "~/state";
import { upperFirst } from "~/utils";

const Admin = () => {
    const router = useRouter();
    const [profile] = useAtom(profileAtom);

    if (!profile.isAdmin) {
        return <h1 className="text-3xl">You do not have access</h1>;
    }

    const sectionsData = ['reviews', 'edits', 'anime', 'add'] as const;

    const handleClick = (item: typeof sectionsData[number]) => {
        if (item === 'add') {
            router.push('/add');
            return;
        }

        router.push(`/admin/${item}`);
    }

    const items = sectionsData.map(s => (
        <div
            key={s}
            className='anime anime-hover'
            onClick={() => handleClick(s)}
        >
            <span className="px-6">
                {upperFirst(s)}
            </span>
        </div>
    ))

    return (
        <>
            <h1 className="text-3xl">Admin Panel</h1>

            <div className="flex flex-col gap-4 text-center">
                {items}
            </div>

            <GoBack />
        </>
    );
}

export default Admin;
import Image from "next/image";
import { useRouter } from "next/router";
import { GoBack, Loading } from "~/bits";
import { fromExternalImg, trpc } from "~/utils";

const Edits = () => {
    const router = useRouter();
    const { data, status } = trpc.useQuery(['edit.list']);

    if (status === 'loading' || !data) {
        return <Loading />;
    }

    const items = data.result.map(item => (
        <div
            key={item.id}
            className="flex w-full items-center justify-around border-b-2 p-2 last:border-b-0"
        >
            <div>{item.user?.name}</div>
            <div>
                <Image
                    className='rounded-full overflow-hidden'
                    src={fromExternalImg(item.user?.image)}
                    alt=''
                    width={45}
                    height={45}
                />
            </div>
            <div>{item.animeTitle}</div>
            <div
                className="cursor-pointer group"
                onClick={() => router.push(`/admin/edits/${item.id}`)}
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 16 16">
                    <path className="fill-black group-hover:fill-red-500 transition-all" d="M7.3 14.875a.994.994 0 0 1-.288-.7.91.91 0 0 1 .263-.7l4.9-4.9H1a.968.968 0 0 1-.713-.288A.967.967 0 0 1 0 7.575a.97.97 0 0 1 .287-.713A.97.97 0 0 1 1 6.575h11.175l-4.9-4.9a.91.91 0 0 1-.263-.7.994.994 0 0 1 .288-.7A.948.948 0 0 1 8 0a.95.95 0 0 1 .7.275l6.6 6.6c.1.083.171.187.213.312.041.125.062.255.062.388s-.02.258-.062.375a.883.883 0 0 1-.213.325l-6.6 6.6a.948.948 0 0 1-.7.275.948.948 0 0 1-.7-.275Z" />
                </svg>
            </div>
        </div>
    ));

    return (
        <>
            <h1 className="text-3xl">Edits</h1>

            <div className="w-full max-w-sm anime">
                {items}
            </div>

            <GoBack />
        </>
    );
};

export default Edits;
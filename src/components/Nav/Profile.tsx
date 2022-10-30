import Image from "next/image";
import { Dispatch, SetStateAction } from "react";
import { If } from "~/bits";

type Props = {
    setIsOpened: Dispatch<SetStateAction<boolean>>;
    isOpened: boolean;
    profileName?: string;
    avatar?: string | null;
    list: Array<{
        name: string;
        action: () => void;
    }>;
}

export const Profile = (props: Props) => {
    const items = props.list.map(item => (
        <li
            key={item.name}
            className='hover:font-bold cursor-pointer'
            onClick={item.action}
        >
            {item.name}
        </li>
    ));

    return (
        <div
            className='px-4 py-2 flex items-center gap-4 hover:bg-red-500 hover:text-white relative'
            onMouseEnter={() => props.setIsOpened(true)}
            onMouseLeave={() => props.setIsOpened(false)}
        >
            {props.profileName}
            <div className='rounded-full'>
                <Image
                    className='rounded-full overflow-hidden'
                    src={props.avatar ?? ''}
                    alt=''
                    width={45}
                    height={45}
                />
            </div>
            <If condition={() => props.isOpened}>
                <ul className='absolute top-16 p-4 left-0 bg-red-500 text-white w-full flex flex-col items-center gap-2'>
                    {items}
                </ul>
            </If>
        </div>
    );
}
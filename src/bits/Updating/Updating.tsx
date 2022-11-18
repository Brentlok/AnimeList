import Image from "next/image";

type Props = {
    isLoading: boolean;
}

export const Updating = (props: Props) => (
    props.isLoading
        ? (
            <div className="fixed bottom-10 right-10">
                <Image
                    src='/ball-triangle.svg'
                    alt=""
                    width={75}
                    height={75}
                />
            </div>
        )
        : null
);
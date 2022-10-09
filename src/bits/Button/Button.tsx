import Image from "next/image";

type Props = {
    buttonAction: () => void;
    buttonText: string;
    isLoading?: boolean;
}

export const Button = (props: Props) => (
    <button
        className="border-2 border-solid border-red-500 rounded-xl p-2 m-2 "
        onClick={props.buttonAction}
    >
        {
            props.isLoading
                ? (
                    <Image
                        src='/ball-triangle.svg'
                        alt=""
                        width={25}
                        height={25}
                    />
                )
                : props.buttonText
        }
    </button>
)
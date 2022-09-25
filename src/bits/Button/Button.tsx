type Props = {
    buttonAction: () => void;
    buttonText: string;
}

export const Button = (props: Props) => (
    <button
        className="border-2 border-solid border-red-500 rounded-xl p-2 m-2"
        onClick={props.buttonAction}
    >
        {props.buttonText}
    </button>
)
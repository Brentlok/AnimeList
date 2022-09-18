import { Dispatch, SetStateAction } from "react";

type Props = {
    placeholder?: string;
    onChange?: Dispatch<SetStateAction<string>>;
    value: string;
}

export const Input = (props: Props) => (
    <input 
        className="border-2 border-solid border-gray-700 rounded-lg p-2"
        placeholder={props.placeholder}
        value={props.value}
        onChange={e => props.onChange?.(e.target.value)}
    />
)
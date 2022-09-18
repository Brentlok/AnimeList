import { Dispatch, SetStateAction } from "react";

type Props = {
    placeholder?: string;
    onChange?: Dispatch<SetStateAction<string>>;
    value: string;
}

export const Input = (props: Props) => (
    <input 
        className="anime"
        placeholder={props.placeholder}
        value={props.value}
        onChange={e => props.onChange?.(e.target.value)}
    />
)
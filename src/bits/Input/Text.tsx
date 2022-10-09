import { Dispatch, SetStateAction, useEffect, useRef } from "react";

type Props = {
    placeholder?: string;
    onChange?: Dispatch<SetStateAction<string>>;
    value: string;
    focusOnStart?: boolean;
}

export const Text = (props: Props) => {
    const ref = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (props.focusOnStart) {
            ref.current?.focus();
        }
    }, [props.focusOnStart]);

    return (
        <input
            ref={ref}
            className="anime"
            placeholder={props.placeholder}
            value={props.value}
            onChange={e => props.onChange?.(e.target.value)}
        />
    )
};
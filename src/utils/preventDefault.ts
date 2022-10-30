import { FormEvent } from "react";

export const preventDefault = (fn: () => void) => (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    fn();
} 
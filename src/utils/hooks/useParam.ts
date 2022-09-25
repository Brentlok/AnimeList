/* eslint-disable react-hooks/exhaustive-deps */
import { useRouter } from "next/router"
import { useEffect, useState } from "react";
import { useDebounce } from "./useDebounce";

export const useParam = (param: string, onEmpty?: () => void) => {
    const [value, setValue] = useState('');
    const debouncedValue = useDebounce(value, 300);
    const router = useRouter();

    useEffect(() => {
        const paramValue = router.query[param];

        if(paramValue === '') {
            router.push('');
        }

        if(typeof paramValue === 'string') {
            setValue(paramValue);
        }

    }, []);

    useEffect(() => {
        if(debouncedValue === '') {
            router.push('');
            onEmpty?.();
            return;
        }

        if(router.query[param] === value) {
            return;
        }

        router.push({
                pathname: '/',
                query: { [param]: debouncedValue },
            });

    }, [debouncedValue]);

    return [value, debouncedValue, setValue] as const;
}
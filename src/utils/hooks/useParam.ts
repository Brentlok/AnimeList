/* eslint-disable react-hooks/exhaustive-deps */
import { useRouter } from "next/router"
import { useEffect, useState } from "react";
import { useDebounce } from "./useDebounce";

export const useParam = (
    param: string,
    pathname: string,
    onEmpty?: (() => void) | string,
) => {
    const [value, setValue] = useState('');
    const [mounted, setMounted] = useState(false);
    const debouncedValue = useDebounce(value, 300);
    const router = useRouter();

    useEffect(() => {
        const paramValue = router.query[param];
        setMounted(true);

        if (paramValue === '') {
            return;
        }

        if (typeof paramValue === 'string') {
            setValue(paramValue);
        }

    }, []);

    useEffect(() => {
        if (!mounted) {
            return;
        }

        if (debouncedValue === '') {
            if (typeof onEmpty === 'string') {
                router.push({
                    pathname: onEmpty,
                });
                return;
            }

            onEmpty?.();
            return;
        }

        if (router.query[param] === value) {
            return;
        }

        router.push({
            pathname,
            query: { [param]: debouncedValue },
        });

    }, [debouncedValue]);

    return [value, debouncedValue, setValue] as const;
}
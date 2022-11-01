/* eslint-disable react-hooks/exhaustive-deps */
import { useRouter } from "next/router"
import { useEffect, useRef, useState } from "react";
import { useDebounce } from "./useDebounce";

type Param =
    | 'anime'
    | 'page';

export const useParam = <T>(
    param: Param,
    defaultValue: T,
    convertToParam: (p: string) => T,
    onEmpty?: string,
) => {
    const [value, setValue] = useState(defaultValue);
    const counter = useRef(0);
    const debouncedValue = useDebounce(value);
    const router = useRouter();

    useEffect(() => {
        const paramValue = router.query[param];

        if (
            paramValue === '' ||
            typeof paramValue !== 'string'
        ) {
            return;
        }

        setValue(convertToParam(paramValue));
    }, []);

    useEffect(() => {
        if (counter.current !== 2) {
            counter.current++;
            return;
        }

        if (debouncedValue === defaultValue) {
            if (!onEmpty) {
                return;
            }

            router.push({
                pathname: onEmpty,
            });
            return;
        }

        const val = String(debouncedValue);

        if (router.query[param] === val) {
            return;
        }

        router.push({
            pathname: router.pathname,
            query: { ...router.query, [param]: val },
        });

    }, [debouncedValue]);

    return [value, debouncedValue, setValue] as const;
}
export const toUndef = <T>(value: T | null) => {
    return value === null ? undefined : value;
};
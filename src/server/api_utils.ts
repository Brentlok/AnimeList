export const toUndef = <T>(value: T | null) => {
    return value === null ? undefined : value;
};

export const base64ToForm = async (base?: string) => {
    const data = await fetch(base ?? '');
    const blob = await data.blob();
    const form = new FormData();
    form.append('file', blob);
    return form;
}
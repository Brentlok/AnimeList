import FormData from 'form-data';

export const toUndef = <T>(value: T | null) => {
    return value === null ? undefined : value;
};

const base64DataUriToBlob = (url: string) => {
    const mime = url.slice(5, url.indexOf(';'));
    const data = atob(url.slice(url.indexOf(',') + 1));
    const binary = new Uint8Array(data.length);

    for (let i = 0; i < data.length; i++) {
        binary[i] = data[i]?.charCodeAt(0) ?? 0;
    }

    try {
        return new Blob([binary], { type: mime });
    } catch (e) {
        return null;
    }
}

export const base64ToForm = async (base?: string) => {
    const blob = base64DataUriToBlob(base ?? '');
    const form = new FormData();

    if (!blob) {
        return form;
    }

    form.append('file', blob);
    return form;
}
import { pocketBase } from "./pocketBase";

export const fromExternalImg = (path: string | null | undefined) => {
    if (!path) {
        return '';
    }

    return /https:\/\//.test(path) ? path : pocketBase.getFileUrl(path);
};
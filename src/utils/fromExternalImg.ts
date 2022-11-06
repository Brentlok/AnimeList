const SERVER_URL = 'http://54.37.138.225:5555/file/';

export const fromExternalImg = (path: string | null | undefined) => {
    if (!path) {
        return '';
    }

    return /https:\/\//.test(path) ? path : `${SERVER_URL}${path}`
};
export const blobToBase64 = (blob: Blob | File) => new Promise<string | undefined>(res => {
    const reader = new FileReader();
    reader.onloadend = () => {
        const result = reader.result;
        res(typeof result === 'string' ? result : undefined);
    }
    reader.readAsDataURL(blob);
})
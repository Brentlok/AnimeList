import Client from 'pocketbase';

class PocketBase {
    private client: Client;

    constructor(readonly db_url: string) {
        this.client = new Client(db_url);
    }

    addFile = async (file: File | Blob, oldFile?: string | null) => {
        if (oldFile && !/https:\/\//.test(oldFile)) {
            const oldFileId = oldFile.split('/').find(() => true) ?? '';
            this.client.records.delete('files', oldFileId);
        }

        const form = new FormData();
        form.append('file', file);
        const created = await this.client.records.create('files', form);
        return `${created.id}/${created.file}`;
    }

    getFileUrl = (path: string) => `${this.db_url}/api/files/files/${path}`;
}

export const pocketBase = new PocketBase('https://db.hbieszczad.pl');
import Client from 'pocketbase';

class PocketBase {
    private client: Client;

    constructor(private readonly db_url: string) {
        this.client = new Client(db_url);
    }

    removeFile = async (file?: string | null) => {
        if (!file || /https:\/\//.test(file)) {
            return;
        }

        const oldFileId = file.split('/').find(() => true) ?? '';
        this.client.records.delete('files', oldFileId);
    }

    addFile = async (file?: File | Blob, oldFile?: string | null) => {
        if (!file) {
            return '';
        }

        this.removeFile(oldFile);

        const form = new FormData();
        form.append('file', file);
        const created = await this.client.records.create('files', form);
        return `${created.id}/${created.file}`;
    }

    getFileUrl = (path: string) => `${this.db_url}/api/files/files/${path}`;
}

export const pocketBase = new PocketBase('https://db.hbieszczad.pl');
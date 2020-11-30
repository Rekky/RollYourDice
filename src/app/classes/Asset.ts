
export class Asset {
    id: string;
    name: string;
    uri: string;
    extension: string;
    data?: any;

    constructor() {
        this.name = '';
        this.uri = '';
        this.extension = '';
        this.id = '';
        this.data = null;
    }
}

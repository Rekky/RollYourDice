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

    static fromJSON(json: any): Asset {
        const asset = new Asset();
        Object.keys(asset).forEach((key) => {
            asset[key] = json[key] ? json[key] : asset[key];
        });
        return asset;
    }
}

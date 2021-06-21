export class Asset {
    id: string;
    name: string;
    extension: string;
    uri: string;
    createdAt: Date;
    updatedAt: Date;

    constructor(id?: string, name?: string, extension?: string, createdAt?: Date, updatedAt?: Date) {
        this.id = id ? id : null;
        this.name = name ? name : null;
        this.extension = extension ? extension : null;
        this.createdAt = createdAt ? createdAt : new Date();
        this.updatedAt = updatedAt ? updatedAt : new Date();
    }

    static fromJSON(json: any): Asset {
        const asset = new Asset();
        Object.keys(asset).forEach((key) => {
            asset[key] = json[key] ? json[key] : asset[key];
        });
        return asset;
    }
}

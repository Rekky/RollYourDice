export class PageAsset {
    name: string;
    url: string;

    constructor(
        name?: string,
        url?: string,
    ) {
        this.name = name ? name : 'image';
        this.url = url ? url : null;
    }
}

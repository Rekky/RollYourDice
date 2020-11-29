
export class CustomImage {
    name: string;
    url: string;

    constructor(name?: string, url?: string) {
        this.name = name ? name : '';
        this.url = url ? url : '';
    }
}

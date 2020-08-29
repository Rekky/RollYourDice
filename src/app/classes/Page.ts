import {Map} from './Map';

export class Page {
    id: string | number;
    name: string;
    maps: Map[];

    constructor(id?: number, name?: any, maps?: Map[]) {
        this.id = id ? id : -1;
        this.name = name ? name : null;
        this.maps = maps ? maps : null;
    }

    static fromJSON(json: any): Page {
        const page = new Page();
        page.id = json.id;
        page.name = json.name;
        page.maps = json.maps.map(el => Map.fromJSON(el));
        return page;
    }

    toJSON(): any {
        const json: any = {};
        json.id = this.id;
        json.name = this.name;
        json.maps = this.maps.map(map => map.toJSON());
        return json;
    }
}

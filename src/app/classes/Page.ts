import {OurKonvaMap} from './ourKonva/OurKonvaMap';

export class Page {
    id: string | null;
    name: string;
    maps: OurKonvaMap[];

    constructor(id?: string, name?: any, maps?: OurKonvaMap[]) {
        this.id = id ? id : null;
        this.name = name ? name : 'new page';
        this.maps = maps ? maps : [];
    }

    static fromJSON(json: any): Page {
        const page = new Page();
        page.id = json.id;
        page.name = json.name;
        page.maps = (json.maps && json.maps.length > 0) ? json.maps.map(el => OurKonvaMap.fromJSON(el)) : [];
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

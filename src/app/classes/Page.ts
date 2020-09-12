import {OurKonvaMap} from './ourKonva/OurKonvaMap';

export class Page {
    id: string | number;
    name: string;
    maps: OurKonvaMap[];

    constructor(id?: number, name?: any, maps?: OurKonvaMap[]) {
        this.id = id ? id : '-' + Math.floor(Math.random() * 1000);
        this.name = name ? name : 'new page';
        this.maps = maps ? maps : [];
    }

    static fromJSON(json: any): Page {
        const page = new Page();
        page.id = json.id;
        page.name = json.name;
        page.maps = json.maps.map(el => OurKonvaMap.fromJSON(el));
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

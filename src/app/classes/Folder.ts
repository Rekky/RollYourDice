import {OurKonvaMap} from './ourKonva/OurKonvaMap';

export class Folder {
    id: string | null;
    name: string;
    maps: OurKonvaMap[];

    constructor(id?: string, name?: any, maps?: OurKonvaMap[]) {
        this.id = id ? id : null;
        this.name = name ? name : 'new folder';
        this.maps = maps ? maps : [];
    }

    static fromJSON(json: any): Folder {
        const folder = new Folder();
        folder.id = json.id;
        folder.name = json.name;
        folder.maps = (json.maps && json.maps.length > 0) ? json.maps.map(el => OurKonvaMap.fromJSON(el)) : [];
        return folder;
    }
}

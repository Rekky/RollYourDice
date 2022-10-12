import {ulid} from 'ulid';
import {OurKonvaMap} from './ourKonva/OurKonvaMap';

export interface MapAttrs {
    container?: any;
    height: number;
    width: number;
    x: number;
    y: number;
    scaleX: number;
    scaleY: number;
}

export class MetaMap {
    id: string;
    attrs?: MapAttrs;

    constructor(id?: string, attrs?: MapAttrs) {
        this.id = id ? id : ulid();
        this.attrs = attrs ? attrs : null;
    }

    static fromJSON(json: any): MetaMap {
        const metaMap = new MetaMap();
        metaMap.id = json.id;
        metaMap.attrs = json.attrs;
        return metaMap;
    }

    public setMetaMap(map: OurKonvaMap): OurKonvaMap {
        console.log('eso1', map);
        console.log('eso2', this.attrs);
        // if (map.stage.attrs !== null) {
        //     map.stage.attrs = this.attrs;
        // }
        map.stage.attrs = this.attrs;
        return map;
    }
}

export class Meta {
    id: string;
    userId: string;
    maps?: MetaMap[];

    constructor(id: string, userId: string, maps?: MetaMap[]) {
        this.id = id ? id : ulid();
        this.userId = userId ? userId : null;
        this.maps = maps ? maps : [];
    }
}


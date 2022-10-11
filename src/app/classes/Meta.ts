import {ulid} from 'ulid';
import {OurKonvaMap} from "./ourKonva/OurKonvaMap";

export interface MapAttrs {
    container?: any;
    x: number;
    y: number;
    scaleX: number;
    scaleY: number;
}

export class MetaMap {
    id: string;
    attrs?: MapAttrs;
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


import {ulid} from 'ulid';

export interface MapAttrs {
    x: number;
    y: number;
    zoom: number;
}

export interface MetaMap {
    id: string;
    attrs?: MapAttrs;
}

export class Meta {
    id: string;
    userId: string;
    maps?: MetaMap[];

    constructor(id: string, userId: string, maps?: {id: string, attrs: MapAttrs}[]) {
        this.id = id ? id : ulid();
        this.userId = userId ? userId : null;
        this.maps = maps ? maps : [];
    }
}


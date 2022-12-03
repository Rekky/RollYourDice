
import { ulid } from 'ulid';
import {Player} from './User';
import {OurKonvaActor} from './ourKonva/OurKonvaActor';
import {OurKonvaRect} from './ourKonva/OurKonvaRect';
import {OurKonvaText} from './ourKonva/OurKonvaText';
import {OurKonvaImage} from './ourKonva/OurKonvaImage';
import {OurKonvaBrush} from './ourKonva/OurKonvaBrush';

export class AssetModel {
    id: string;
    name: string;
    extension: string;
    uri: string;
    type: AssetType;
    createdAt: Date;
    updatedAt: Date;
    author: Player;
    mapRepresentation: (OurKonvaRect | OurKonvaText | OurKonvaImage | OurKonvaBrush);

    constructor(id?: string, name?: string, extension?: string, uri?: string, type?: AssetType, createdAt?: Date, updatedAt?: Date) {
        this.id = ulid();
        this.name = name ? name : null;
        this.uri = uri ? uri : null;
        this.type = type ? type : AssetType.Image;
        this.extension = extension ? extension : null;
        this.createdAt = createdAt ? createdAt : new Date();
        this.updatedAt = updatedAt ? updatedAt : new Date();
        this.author = null;
        this.mapRepresentation = null;
    }
}

export enum AssetType {
    Image = 'image',
    Video = 'video',
    Audio = 'audio',
    Unknown = 'unknown'
}

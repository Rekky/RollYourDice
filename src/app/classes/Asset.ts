
import { ulid } from 'ulid';
import {Player} from './User';

export class Asset {
    id: string;
    name: string;
    extension: string;
    uri: string;
    type: AssetType;
    createdAt: Date;
    updatedAt: Date;
    author: Player;

    constructor(id?: string, name?: string, extension?: string, uri?: string, type?: AssetType, createdAt?: Date, updatedAt?: Date) {
        this.id = ulid();
        this.name = name ? name : null;
        this.uri = uri ? uri : null;
        this.type = type ? type : AssetType.Image;
        this.extension = extension ? extension : null;
        this.createdAt = createdAt ? createdAt : new Date();
        this.updatedAt = updatedAt ? updatedAt : new Date();
        this.author = null;
    }
}

export enum AssetType {
    Image = 'image',
    Video = 'video',
    Audio = 'audio'
}

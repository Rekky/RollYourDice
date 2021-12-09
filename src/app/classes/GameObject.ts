import {Coords} from './Coords';
import { ulid } from 'ulid';

export class GameObject {
    id: string;
    name: string;
    position: Coords;

    constructor(id?: string, name?: string, position?: Coords) {
        this.id = id ? id : ulid();
        this.name = name ? name : 'new object';
        this.position = position ? position : new Coords();
    }
}

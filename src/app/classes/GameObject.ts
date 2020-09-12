import {Coords} from './Coords';

export class GameObject {
    id: string;
    name: string;
    position: Coords;

    constructor(id?: string, name?: string, position?: Coords) {
        this.id = id ? id : '-' + Math.floor(Math.random() * 1000);
        this.name = name ? name : 'new object';
        this.position = position ? position : new Coords();
    }
}

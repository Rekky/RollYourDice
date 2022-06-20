import {ulid} from 'ulid';

export class Camera {
    id: string;
    name: string;
    width: number;
    height: number;
    x: number;
    y: number;
    z?: number;
    active: boolean;

    constructor(id?: string, name?: string) {
        this.id = id ? id : ulid();
        this.name = name ? name : 'New Camera';
        this.width = 0;
        this.height = 0;
        this.x = 0;
        this.y = 0;
        this.z = 0;
        this.active = false;
    }
}

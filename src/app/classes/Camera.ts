export class Camera {
    id: string;
    width: number;
    height: number;
    x: number;
    y: number;
    z?: number;
    active: boolean;

    constructor() {
        this.id = null;
        this.width = 0;
        this.height = 0;
        this.x = 0;
        this.y = 0;
        this.z = 0;
        this.active = false;
    }
}

import {Coords} from './Coords';
import {Mouse} from './Mouse';

export class Pointer extends Mouse {
    state: string = 'pointer';
    startCoords: Coords;
    offsetCoords: Coords;

    constructor() {
        super();
        this.startCoords = new Coords();
        this.offsetCoords = new Coords();
    }

    mouseDown(): void {
        super.mouseDown();
        this.startCoords.x = this.ev.clientX - this.offsetCoords.x;
        this.startCoords.y = this.ev.clientY - this.offsetCoords.y;
    }

    mouseMove(): void {
        super.mouseMove();
        this.offsetCoords.x = this.ev.clientX - this.startCoords.x;
        this.offsetCoords.y = this.ev.clientY - this.startCoords.y;
    }
}

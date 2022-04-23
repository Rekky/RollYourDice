import {Coords} from '../Coords';
import {OurKonvaMouse} from './OurKonvaMouse';
import Konva from 'konva';
import { Player } from '../User';

export class OurKonvaPointer extends OurKonvaMouse {
    state: string = 'pointer';
    startCoords: Coords;
    offsetCoords: Coords;

    constructor(author?: Player) {
        super(author);
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

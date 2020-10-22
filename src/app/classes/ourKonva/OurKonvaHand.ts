import {Coords} from '../Coords';
import {OurKonvaMouse} from './OurKonvaMouse';

export class OurKonvaHand extends OurKonvaMouse {
    state: string = 'hand';
    startCoords: Coords;
    offsetCoords: Coords;

    constructor() {
        super();
        this.startCoords = new Coords();
        this.offsetCoords = new Coords();
    }

    mouseDown(): void {
        super.mouseDown();
    }

    mouseMove(): void {
        super.mouseMove();
    }
}

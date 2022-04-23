import {Coords} from '../Coords';
import {OurKonvaMouse} from './OurKonvaMouse';
import {Player} from '../User';

export class OurKonvaHand extends OurKonvaMouse {
    state: string = 'hand';
    startCoords: Coords;
    offsetCoords: Coords;

    constructor(author: Player) {
        super(author);
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

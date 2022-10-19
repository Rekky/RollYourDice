import {Coords} from '../Coords';
import {OurKonvaObject} from './OurKonvaObject';
import {Player} from '../User';
import {OurKonvaLayers} from './OurKonvaLayers';

export class OurKonvaHand extends OurKonvaObject {
    state: string = 'hand';
    startCoords: Coords;
    offsetCoords: Coords;

    constructor(author: Player) {
        super(author);
        this.startCoords = new Coords();
        this.offsetCoords = new Coords();
    }

    mouseDown(layers: OurKonvaLayers): void {
        super.mouseDown(layers);
        this.layer = layers.draws;
    }

    mouseMove(): void {
        super.mouseMove();
    }
}

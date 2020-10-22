import Konva from 'konva';
import {OurKonvaMouse} from './OurKonvaMouse';

export class OurKonvaEraser extends OurKonvaMouse {
    state: string = 'eraser';
    line: Konva.Line;

    constructor() {
        super();
        this.line = new Konva.Line();
    }

    mouseDown(): void {
    }

    mouseMove(): void {
    }
}

import Konva from 'konva';
import {Coords} from '../Coords';
import {OurKonvaGrid} from './OurKonvaGrid';
import {OurKonvaLayers} from './OurKonvaLayers';
import {OurKonvaSize} from './OurKonvaSize';

export class OurKonvaMouse {
    isActive: boolean;
    stage: Konva.Stage;
    layers: OurKonvaLayers;
    state: string;
    ev: MouseEvent;
    cellSize: number;
    size: OurKonvaSize;
    name: string;

    constructor() {
        this.isActive = false;
        this.stage = null;
        this.layers = null;
        this.ev = null;
        this.cellSize = 100;
        this.size = new OurKonvaSize();
    }

    mouseDown(): any {}
    mouseMove(): void {}
    mouseUp(): any {}
    mouseOut(): void {}

    public adaptPositionToGrid(object: any): void {
        object.on('dragstart', () => {
            object.moveToTop();
        });
        object.on('dragend', () => {
            const newPosition = OurKonvaGrid.correctPosition(new Coords(object.x(), object.y()), this.cellSize);
            object.position({
                x: newPosition.x,
                y: newPosition.y
            });
            this.stage.batchDraw();
        });
        object.on('dragmove', () => {
            const newPosition = OurKonvaGrid.correctPosition(new Coords(object.x(), object.y()), this.cellSize);
            this.stage.batchDraw();
        });
    }
}

export class CurrentSelectedKonvaObject {
    konvaObject: Konva.Rect | Konva.Text | Konva.Image;
    type: string;
    layer: Konva.Layer;
    transformer: Konva.Transformer;

    constructor() {
        this.konvaObject = new Konva.Rect();
        this.type = 'square';
        this.layer = new Konva.Layer();
        this.transformer = new Konva.Transformer();
    }
}

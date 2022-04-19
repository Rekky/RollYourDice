import Konva from 'konva';
import {Coords} from '../Coords';
import {OurKonvaGrid} from './OurKonvaGrid';
import {OurKonvaLayers} from './OurKonvaLayers';
import {OurKonvaSize} from './OurKonvaSize';
import {OurKonvaRect} from './OurKonvaRect';
import {OurKonvaText} from './OurKonvaText';
import {OurKonvaImage} from './OurKonvaImage';

export class OurKonvaMouse {
    isActive: boolean;
    stage: Konva.Stage;
    layers: OurKonvaLayers;
    state: string;
    ev: MouseEvent;
    cellSize: number;
    size: OurKonvaSize;
    name: string;
    isAdaptedToGrid: boolean;

    constructor() {
        this.isActive = false;
        this.stage = null;
        this.layers = null;
        this.ev = null;
        this.cellSize = 40;
        this.size = new OurKonvaSize();
        this.isAdaptedToGrid = true;
    }
    static calculateObjectPositionOnGrid(object: CurrentSelectedKonvaObject, gridStage: Konva.Stage): Coords {
        const objectAttrs = object.konvaObject.getAttrs();
        const gridStageX = gridStage?.getAttrs()?.x ? gridStage?.getAttrs()?.x : 0;
        const gridStageY = gridStage?.getAttrs()?.y ? gridStage?.getAttrs()?.y : 0;
        const coord = new Coords();
        coord.x = Math.round( gridStageX + objectAttrs.x);
        coord.y = Math.round( gridStageY + objectAttrs.y);
        return coord;
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
    ourKonvaObject: OurKonvaRect | OurKonvaText | OurKonvaImage;
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

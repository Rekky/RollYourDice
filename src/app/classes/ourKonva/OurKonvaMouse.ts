import Konva from 'konva';
import {Coords} from '../Coords';
import {OurKonvaGrid} from './OurKonvaGrid';
import {OurKonvaLayers} from './OurKonvaLayers';
import {OurKonvaSize} from './OurKonvaSize';
import {OurKonvaRect} from './OurKonvaRect';
import {OurKonvaText} from './OurKonvaText';
import {OurKonvaImage} from './OurKonvaImage';
import { Player } from '../User';

export class OurKonvaMouse {
    isActive: boolean;
    author: Player;
    stage: Konva.Stage;
    layers: OurKonvaLayers;
    state: string;
    ev: MouseEvent;
    cellSize: number;
    size: OurKonvaSize;
    name: string;
    isAdaptedToGrid: boolean;
    isEditionBlocked: boolean;

    constructor(author: Player) {
        this.isActive = false;
        this.stage = null;
        this.layers = null;
        this.ev = null;
        this.cellSize = 40;
        this.size = new OurKonvaSize();
        this.isAdaptedToGrid = true;
        this.isEditionBlocked = false;
        this.author = author;
    }

    static calculateObjectPositionOnGrid(object: CurrentSelectedKonvaObject, gridStage: Konva.Stage): Coords {
        const objectAttrs = object.konvaObject.getAttrs();
        const gridStageX = gridStage.getPosition().x ? gridStage.getPosition().x : 0;
        const gridStageY = gridStage.getPosition().y ? gridStage.getPosition().y : 0;
        const coord = new Coords();
        coord.x = Math.round( objectAttrs.x * gridStage.scaleX() + gridStageX);
        coord.y = Math.round( objectAttrs.y * gridStage.scaleY() + gridStageY);
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

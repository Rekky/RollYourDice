import Konva from 'konva';
import {Coords} from '../Coords';
import {OurKonvaGrid} from './OurKonvaGrid';
import {OurKonvaLayers} from './OurKonvaLayers';
import {OurKonvaScale, OurKonvaSize} from './OurKonvaSize';
import {OurKonvaRect} from './OurKonvaRect';
import {OurKonvaText} from './OurKonvaText';
import {OurKonvaImage} from './OurKonvaImage';
import { Player } from '../User';
import {OurKonvaBrush} from './OurKonvaBrush';

export class OurKonvaObject {
    isActive: boolean;
    author: Player;
    stage: Konva.Stage;
    layer: Konva.Layer;
    type: string;
    ev: MouseEvent;
    cellSize: number;
    size: OurKonvaSize;
    scale: OurKonvaScale;
    name: string;
    isAdaptedToGrid: boolean;
    isEditionBlocked: boolean;

    constructor(author: Player) {
        this.isActive = false;
        this.stage = null;
        this.layer = null;
        this.ev = null;
        this.cellSize = 40;
        this.size = new OurKonvaSize();
        this.isAdaptedToGrid = true;
        this.isEditionBlocked = false;
        this.author = author;
        this.scale = new OurKonvaScale();
    }

    static calculateObjectPositionOnGrid(object: CurrentSelectedKonvaObject, gridStage: Konva.Stage): Coords {
        if (object) {
            const objectAttrs = object.konvaObject.getAttrs();
            const gridStageX = gridStage.getPosition().x ? gridStage.getPosition().x : 0;
            const gridStageY = gridStage.getPosition().y ? gridStage.getPosition().y : 0;
            const coord = new Coords();
            coord.x = Math.round( objectAttrs.x * gridStage.scaleX() + gridStageX);
            coord.y = Math.round( objectAttrs.y * gridStage.scaleY() + gridStageY);
            return coord;
        }
    }

    mouseDown(layers: OurKonvaLayers): any {}
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
    konvaObject: Konva.Rect | Konva.Text | Konva.Image | Konva.Line | Konva.Node;
    ourKonvaObject: OurKonvaRect | OurKonvaText | OurKonvaImage | OurKonvaBrush | any;
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

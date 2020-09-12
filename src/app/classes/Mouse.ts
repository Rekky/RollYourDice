import Konva from 'konva';
import {Grid} from './Grid';
import {Coords} from './Coords';

export class Mouse {
    isActive: boolean;
    stage: Konva.Stage;
    layer: Konva.Layer;
    state: string;
    ev: MouseEvent;
    cellSize: number;

    constructor(stage?: Konva.Stage, layer?: Konva.Layer, ev?: MouseEvent, isActive?: boolean, cellSize?: number) {
        this.isActive = isActive ? isActive : false;
        this.stage = stage ? stage : null;
        this.layer = layer ? layer : null;
        this.ev = ev ? ev : null;
        this.cellSize = cellSize ? cellSize : 40;
    }

    mouseDown(): void | CurrentSelectedObject {}
    mouseMove(): void {}
    mouseUp(): void {}
    mouseOut(): void {}

    public adaptPositionToGrid(object: any): void {
        object.on('dragstart', () => {
            object.moveToTop();
        });
        object.on('dragend', () => {
            const newPosition = Grid.correctPosition(new Coords(object.x(), object.y()), this.cellSize);
            object.position({
                x: newPosition.x,
                y: newPosition.y
            });
            this.stage.batchDraw();
        });
        object.on('dragmove', () => {
            const newPosition = Grid.correctPosition(new Coords(object.x(), object.y()), this.cellSize);
            this.stage.batchDraw();
        });
    }
}

export class CurrentSelectedObject {
    transformer: Konva.Transformer;
    attr: any;

    constructor(tr: Konva.Transformer, attr: any) {
        this.transformer = tr;
        this.attr = attr;
    }
}

import Konva from 'konva';
import { Player } from '../User';
import {OurKonvaObject} from './OurKonvaObject';

export class OurKonvaEraser extends OurKonvaObject {
    state: string = 'eraser';
    line: Konva.Line;
    brushSize: number;

    constructor(author: Player) {
        super(author);
        this.line = new Konva.Line();
        this.brushSize = 20;
    }

    mouseDown(): void {
        super.mouseDown();
        const pos = this.stage.getPointerPosition();
        this.line = new Konva.Line({
            stroke: '#ffc107',
            strokeWidth: this.brushSize,
            globalCompositeOperation: 'destination-out',
            points: [pos.x, pos.y],
        });
        this.layers.draws.add(this.line);
    }

    mouseMove(): void {
        if (this.isActive) {
            super.mouseMove();
            const pos = this.stage.getPointerPosition();
            const newPoints = this.line.points().concat([pos.x, pos.y]);
            this.line.points(newPoints);
            this.layers.draws.batchDraw();
        }
    }
}

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
        super.mouseDown();
        const pos = this.stage.getPointerPosition();
        this.line = new Konva.Line({
            stroke: '#ffc107',
            strokeWidth: 10,
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

import Konva from 'konva';
import {OurKonvaMouse} from './OurKonvaMouse';

export class OurKonvaBrush extends OurKonvaMouse {
    state: string = 'brush';
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
            strokeWidth: 5,
            globalCompositeOperation: 'source-over',
            points: [pos.x, pos.y],
        });
        this.layer.add(this.line);
    }

    mouseMove(): void {
        if (this.isActive) {
            super.mouseMove();
            const pos = this.stage.getPointerPosition();
            const newPoints = this.line.points().concat([pos.x, pos.y]);
            this.line.points(newPoints);
            this.layer.batchDraw();
        }
    }
}

import Konva from 'konva';
import {OurKonvaMouse} from './OurKonvaMouse';

export class OurKonvaBrush extends OurKonvaMouse {
    state: string = 'brush';
    line: Konva.Line;
    color: string;
    brushSize: number;

    constructor() {
        super();
        this.line = new Konva.Line();
        this.color = '#ffff00';
        this.brushSize = 5;
    }

    mouseDown(): void {
        super.mouseDown();
        const pos = this.stage.getPointerPosition();
        this.line = new Konva.Line({
            stroke: this.color,
            strokeWidth: this.brushSize,
            lineCap: 'round',
            lineJoin: 'round',
            globalCompositeOperation: 'source-over',
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

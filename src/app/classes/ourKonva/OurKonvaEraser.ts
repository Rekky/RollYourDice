import Konva from 'konva';
import { Player } from '../User';
import {OurKonvaObject} from './OurKonvaObject';
import {OurKonvaLayers} from './OurKonvaLayers';

export class OurKonvaEraser extends OurKonvaObject {
    type: string = 'eraser';
    line: Konva.Line;
    brushSize: number;

    constructor(author: Player) {
        super(author);
        this.line = new Konva.Line();
        this.brushSize = 20;
    }

    mouseDown(layers: OurKonvaLayers): void {
        super.mouseDown(layers);
        const pos = this.stage.getPointerPosition();
        this.line = new Konva.Line({
            stroke: '#ffc107',
            strokeWidth: this.brushSize,
            globalCompositeOperation: 'destination-out',
            points: [pos.x, pos.y],
        });
        this.layer = layers.draws;
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

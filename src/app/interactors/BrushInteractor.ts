import {Injectable} from '@angular/core';
import Konva from 'konva';

@Injectable({
    providedIn: 'root'
})
export class BrushInteractor {
    isPainting: boolean = false;

    stage: Konva.Stage;
    layer: Konva.Layer;
    line: Konva.Line;

    constructor() {}

    startPainting(): void {
        this.isPainting = true;
        const pos = this.stage.getPointerPosition();
        this.line = new Konva.Line({
            stroke: '#ffc107',
            strokeWidth: 5,
            globalCompositeOperation: 'source-over',
            points: [pos.x, pos.y],
        });
        this.layer.add(this.line);
    }
}

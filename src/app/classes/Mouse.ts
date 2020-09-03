import Konva from 'konva';
import {Coords} from './Coords';
import {Map} from './Map';

export class Mouse {
    mouseDown(options: MouseOptions): void {}
    mouseMove(options: MouseOptions): void {}
}

export class Cursor extends Mouse {
    mouseDown(options: MouseOptions): void {
        super.mouseDown(options);
        options.cursorOptions.startCoords.x = options.cursorOptions.ev.clientX - options.cursorOptions.offsetCoords.x;
        options.cursorOptions.startCoords.y = options.cursorOptions.ev.clientY - options.cursorOptions.offsetCoords.y;
    }

    mouseMove(options: MouseOptions): void {
        super.mouseMove(options);
        options.cursorOptions.offsetCoords.x = options.cursorOptions.ev.clientX - options.cursorOptions.startCoords.x;
        options.cursorOptions.offsetCoords.y = options.cursorOptions.ev.clientY - options.cursorOptions.startCoords.y;
    }
}

export class MoveMap extends Mouse {
    mouseDown(options: MouseOptions): void {
        super.mouseDown(options);
        options.cursorOptions.startCoords.x = options.cursorOptions.ev.clientX - options.cursorOptions.offsetCoords.x;
        options.cursorOptions.startCoords.y = options.cursorOptions.ev.clientY - options.cursorOptions.offsetCoords.y;
    }

    mouseMove(options: MouseOptions): void {
        super.mouseMove(options);
        if (options.cursorOptions.isDragging) {
            options.cursorOptions.map.position.x = options.cursorOptions.ev.clientX - options.cursorOptions.startCoords.x;
            options.cursorOptions.map.position.y = options.cursorOptions.ev.clientY - options.cursorOptions.startCoords.y;
        }
        options.cursorOptions.offsetCoords.x = options.cursorOptions.map.position.x;
        options.cursorOptions.offsetCoords.y = options.cursorOptions.map.position.y;
    }
}

export class Brush extends Mouse {
    mouseDown(options: MouseOptions): void {
        super.mouseDown(options);
        const pos = options.paintOptions.stage.getPointerPosition();
        options.paintOptions.line = new Konva.Line({
            stroke: '#ffc107',
            strokeWidth: 5,
            globalCompositeOperation: 'source-over',
            points: [pos.x, pos.y],
        });
        options.paintOptions.layer.add(options.paintOptions.line);
    }

    mouseMove(options: MouseOptions): void {
        if (options.paintOptions.isPainting) {
            super.mouseMove(options);
            const pos = options.paintOptions.stage.getPointerPosition();
            const newPoints = options.paintOptions.line.points().concat([pos.x, pos.y]);
            options.paintOptions.line.points(newPoints);
            options.paintOptions.layer.batchDraw();
        }
    }
}

export class MouseOptions {
    paintOptions: PaintOptions;
    cursorOptions: CursorOptions;

    constructor(cursorOptions?: CursorOptions, paintOptions?: PaintOptions) {
        this.cursorOptions = cursorOptions ? cursorOptions : new CursorOptions();
        this.paintOptions = paintOptions ? paintOptions : new PaintOptions();
    }
}

export class CursorOptions {
    ev?: MouseEvent;
    startCoords?: Coords;
    offsetCoords?: Coords;
    map?: Map;
    isDragging?: boolean;

    constructor(ev?: MouseEvent, startCoords?: Coords, offsetCoords?: Coords, map?: Map, isDragging?: boolean) {
        this.startCoords = startCoords ? startCoords : new Coords();
        this.offsetCoords = offsetCoords ? offsetCoords : new Coords();
        this.map = map ? map : new Map();
        this.ev = ev ? ev : null;
        this.isDragging = isDragging ? isDragging : false;
    }
}

export class PaintOptions {
    stage?: Konva.Stage;
    layer?: Konva.Layer;
    line?: Konva.Line;
    isPainting?: boolean;

    constructor(stage?: Konva.Stage, layer?: Konva.Layer, line?: Konva.Line, isPainting?: boolean) {
        this.stage = stage ? stage : null;
        this.layer = layer ? layer : null;
        this.line = line ? line : null;
        this.isPainting = isPainting ? isPainting : false;
    }
}

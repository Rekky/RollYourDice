import Konva from 'konva';
import {BrushInteractor} from '../interactors/BrushInteractor';
import {StageConfig} from 'konva/types/Stage';
import {Coords} from './Coords';
import {Map} from './Map';

export class Mouse {
    isActive: boolean;
    stage: Konva.Stage;
    layer: Konva.Layer;

    constructor(stage?: Konva.Stage, layer?: Konva.Layer, isActive?: boolean) {
        this.isActive = isActive ? isActive : false;
        this.stage = stage ? stage : null;
        this.layer = layer ? layer : null;
    }
    mouseDown(options: MouseOptions): void {}
    mouseMove(options: MouseOptions): void {}
    mouseUp(options: MouseOptions): void {}
    mouseOut(options: MouseOptions): void {}
}

export class Pointer extends Mouse {
    mouseDown(options: MouseOptions): void {
        super.mouseDown(options);
        options.pointerOptions.startCoords.x = options.pointerOptions.ev.clientX - options.pointerOptions.offsetCoords.x;
        options.pointerOptions.startCoords.y = options.pointerOptions.ev.clientY - options.pointerOptions.offsetCoords.y;
    }

    mouseMove(options: MouseOptions): void {
        super.mouseMove(options);
        options.pointerOptions.offsetCoords.x = options.pointerOptions.ev.clientX - options.pointerOptions.startCoords.x;
        options.pointerOptions.offsetCoords.y = options.pointerOptions.ev.clientY - options.pointerOptions.startCoords.y;
    }
}

export class MoveMap extends Mouse {
    mouseDown(options: MouseOptions): void {
        super.mouseDown(options);
        options.pointerOptions.startCoords.x = options.pointerOptions.ev.clientX - options.pointerOptions.offsetCoords.x;
        options.pointerOptions.startCoords.y = options.pointerOptions.ev.clientY - options.pointerOptions.offsetCoords.y;
    }

    mouseMove(options: MouseOptions): void {
        super.mouseMove(options);
        if (options.isActive) {
            options.pointerOptions.map.position.x = options.pointerOptions.ev.clientX - options.pointerOptions.startCoords.x;
            options.pointerOptions.map.position.y = options.pointerOptions.ev.clientY - options.pointerOptions.startCoords.y;
        }
        options.pointerOptions.offsetCoords.x = options.pointerOptions.map.position.x;
        options.pointerOptions.offsetCoords.y = options.pointerOptions.map.position.y;
    }

    mouseUp(options: MouseOptions): void {
        super.mouseUp(options);
    }

    mouseOut(options: MouseOptions): void {
        super.mouseOut(options);
    }
}

export class Brush extends Mouse {
    mouseDown(options: MouseOptions): void {
        super.mouseDown(options);
        const pos = options.stage.getPointerPosition();
        options.paintOptions.line = new Konva.Line({
            stroke: '#ffc107',
            strokeWidth: 5,
            globalCompositeOperation: 'source-over',
            points: [pos.x, pos.y],
        });
        options.layer.add(options.paintOptions.line);
    }

    mouseMove(options: MouseOptions): void {
        if (options.isActive) {
            super.mouseMove(options);
            const pos = options.stage.getPointerPosition();
            const newPoints = options.paintOptions.line.points().concat([pos.x, pos.y]);
            options.paintOptions.line.points(newPoints);
            options.layer.batchDraw();
        }
    }
}

export class Text extends Mouse {
    mouseDown(options: MouseOptions): void {
        super.mouseDown(options);
        const pos = options.stage.getPointerPosition();
        options.textOptions.text = new Konva.Text({
            text: 'Some text here',
            x: pos.x,
            y: pos.y,
            fontSize: 20,
            draggable: true,
            width: 200,
        });
        options.layer.add(options.textOptions.text);

        const transformer = new Konva.Transformer({
            node: options.textOptions.text,
            enabledAnchors: ['middle-left', 'middle-right'],
            boundBoxFunc: (oldBox, newBox) => {
                newBox.width = Math.max(30, newBox.width);
                return newBox;
            },
        });

        options.layer.add(transformer);
        options.layer.batchDraw();
    }
}

export class MouseOptions {
    paintOptions: PaintOptions;
    pointerOptions: PointerOptions;
    textOptions: TextOptions;
    stage: Konva.Stage;
    layer: Konva.Layer;
    isActive: boolean;

    constructor(stage: Konva.Stage, layer: Konva.Layer, isActive?: boolean,
                pointerOptions?: PointerOptions, paintOptions?: PaintOptions, textOptions?: TextOptions) {
        this.pointerOptions = pointerOptions ? pointerOptions : new PointerOptions();
        this.paintOptions = paintOptions ? paintOptions : new PaintOptions();
        this.textOptions = textOptions ? textOptions : new TextOptions();
        this.stage = stage;
        this.layer = layer;
        this.isActive = isActive;
    }
}

export class PointerOptions {
    ev?: MouseEvent;
    startCoords?: Coords;
    offsetCoords?: Coords;
    map?: Map;

    constructor(ev?: MouseEvent, startCoords?: Coords, offsetCoords?: Coords, map?: Map) {
        this.startCoords = startCoords ? startCoords : new Coords();
        this.offsetCoords = offsetCoords ? offsetCoords : new Coords();
        this.map = map ? map : new Map();
        this.ev = ev ? ev : null;
    }
}

export class PaintOptions {
    line?: Konva.Line;

    constructor(line?: Konva.Line) {
        this.line = line ? line : null;
    }
}

export class TextOptions {
    text?: Konva.Text;

    constructor(text?: Konva.Text) {
        this.text = text ? text : null;
    }
}

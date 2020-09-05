import Konva from 'konva';
import {BrushInteractor} from '../interactors/BrushInteractor';
import {StageConfig} from 'konva/types/Stage';
import {Coords} from './Coords';
import {Map} from './Map';

export class Mouse {
    isActive: boolean;
    stage: Konva.Stage;
    layer: Konva.Layer;
    state: string;

    constructor(stage?: Konva.Stage, layer?: Konva.Layer, isActive?: boolean) {
        this.isActive = isActive ? isActive : false;
        this.stage = stage ? stage : null;
        this.layer = layer ? layer : null;
    }
    mouseDown(options: MouseOptions): void | Pointer {}
    mouseMove(options: MouseOptions): void {}
    mouseUp(options: MouseOptions): void {}
    mouseOut(options: MouseOptions): void {}
}

export class Pointer extends Mouse {
    state: string = 'pointer';

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
    state: string = 'moveMap';

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
    state: string = 'brush';

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
    state: string = 'text';

    mouseDown(options: MouseOptions): Pointer {
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
            nodes: [options.textOptions.text],
            enabledAnchors: ['middle-left', 'middle-right'],
            boundBoxFunc: (oldBox, newBox) => {
                newBox.width = Math.max(30, newBox.width);
                return newBox;
            },
        });

        options.layer.add(transformer);
        options.layer.batchDraw();

        options.textOptions.text.on('transform', () => {
            options.textOptions.text.setAttrs({
                width: Math.max(options.textOptions.text.width() * options.textOptions.text.scaleX(), 30),
                scaleX: 1,
                scaleY: 1,
            });
        });

        options.textOptions.text.on('dblclick', () => {
            options.textOptions.text.hide();
            transformer.hide();
            options.textOptions.text.draw();

            const textPosition = options.textOptions.text.absolutePosition();
            const stageBox = options.stage.container().getBoundingClientRect();
            const areaPosition = {
                x: stageBox.left + textPosition.x,
                y: stageBox.top + textPosition.y,
            };

            const textarea = document.createElement('textarea');
            document.body.appendChild(textarea);
            textarea.value = options.textOptions.text.text();
            textarea.style.position = 'absolute';
            textarea.style.top = areaPosition.y + 'px';
            textarea.style.left = areaPosition.x + 'px';
            textarea.style.width = options.textOptions.text.width() - options.textOptions.text.padding() * 2 + 'px';
            textarea.style.height = options.textOptions.text.height() - options.textOptions.text.padding() * 2 + 5 + 'px';
            textarea.style.fontSize = options.textOptions.text.fontSize() + 'px';
            textarea.style.border = 'none';
            textarea.style.padding = '0px';
            textarea.style.margin = '0px';
            textarea.style.overflow = 'hidden';
            textarea.style.background = 'none';
            textarea.style.outline = 'none';
            textarea.style.resize = 'none';
            textarea.style.fontFamily = options.textOptions.text.fontFamily();
            textarea.style.transformOrigin = 'left top';
            textarea.style.textAlign = options.textOptions.text.align();
            textarea.style.color = options.textOptions.text.fill();
            const rotation = options.textOptions.text.rotation();
            const transform = '';
        });
        // return new Pointer();
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

    constructor() {
        this.line = null;
    }
}

export class TextOptions {
    text?: Konva.Text;

    constructor() {
        this.text = null;
    }
}

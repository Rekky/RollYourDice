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
    ev: MouseEvent;
    options: MouseOptions;

    constructor(stage?: Konva.Stage, layer?: Konva.Layer, ev?: MouseEvent, isActive?: boolean) {
        this.isActive = isActive ? isActive : false;
        this.stage = stage ? stage : null;
        this.layer = layer ? layer : null;
        this.ev = ev ? ev : null;
    }

    mouseDown(): void | Pointer {}
    mouseMove(): void {}
    mouseUp(): void {}
    mouseOut(): void {}
}

export class Pointer extends Mouse {
    state: string = 'pointer';
    options: PointerOptions;

    constructor() {
        super();
        this.options = new PointerOptions();
    }

    mouseDown(): void {
        super.mouseDown();
        this.options.startCoords.x = this.ev.clientX - this.options.offsetCoords.x;
        this.options.startCoords.y = this.ev.clientY - this.options.offsetCoords.y;
    }

    mouseMove(): void {
        super.mouseMove();
        this.options.offsetCoords.x = this.ev.clientX - this.options.startCoords.x;
        this.options.offsetCoords.y = this.ev.clientY - this.options.startCoords.y;
    }
}

// export class MoveMap {
//     state: string = 'moveMap';
//
//     mouseDown(options: PointerOptions): void {
//         super.mouseDown(options);
//         options.startCoords.x = options.ev.clientX - options.offsetCoords.x;
//         options.startCoords.y = options.ev.clientY - options.offsetCoords.y;
//     }
//
//     mouseMove(options: PointerOptions): void {
//         super.mouseMove(options);
//         if (options.isActive) {
//             options.map.position.x = options.ev.clientX - options.startCoords.x;
//             options.map.position.y = options.ev.clientY - options.startCoords.y;
//         }
//         options.offsetCoords.x = options.map.position.x;
//         options.offsetCoords.y = options.map.position.y;
//     }
//
//     mouseUp(options: MouseOptions): void {
//         super.mouseUp(options);
//     }
//
//     mouseOut(options: MouseOptions): void {
//         super.mouseOut(options);
//     }
// }

export class Brush extends Mouse {
    state: string = 'brush';
    options: BrushOptions;

    constructor() {
        super();
        this.options = new BrushOptions();
    }

    mouseDown(): void {
        super.mouseDown();
        const pos = this.stage.getPointerPosition();
        this.options.line = new Konva.Line({
            stroke: '#ffc107',
            strokeWidth: 5,
            globalCompositeOperation: 'source-over',
            points: [pos.x, pos.y],
        });
        this.layer.add(this.options.line);
    }

    mouseMove(): void {
        if (this.isActive) {
            super.mouseMove();
            const pos = this.stage.getPointerPosition();
            const newPoints = this.options.line.points().concat([pos.x, pos.y]);
            this.options.line.points(newPoints);
            this.layer.batchDraw();
        }
    }
}

export class Text extends Mouse {
    state: string = 'text';
    options: TextOptions;

    constructor() {
        super();
        this.options = new TextOptions();
    }

    mouseDown(): Pointer {
        super.mouseDown();
        const pos = this.stage.getPointerPosition();
        this.options.text = new Konva.Text({
            text: 'Some text here',
            x: pos.x,
            y: pos.y,
            fontSize: 20,
            draggable: true,
            width: 200,
        });
        this.layer.add(this.options.text);

        const transformer = new Konva.Transformer({
            nodes: [this.options.text],
            enabledAnchors: ['middle-left', 'middle-right'],
            boundBoxFunc: (oldBox, newBox) => {
                newBox.width = Math.max(30, newBox.width);
                return newBox;
            },
        });

        this.layer.add(transformer);
        this.layer.batchDraw();

        this.options.text.on('transform', () => {
            this.options.text.setAttrs({
                width: Math.max(this.options.text.width() * this.options.text.scaleX(), 30),
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
}

export class PointerOptions extends MouseOptions {
    startCoords?: Coords;
    offsetCoords?: Coords;

    constructor() {
        super();
        this.startCoords = new Coords();
        this.offsetCoords = new Coords();
    }
}

export class BrushOptions extends MouseOptions {
    line?: Konva.Line;

    constructor() {
        super();
        this.line = new Konva.Line();
    }
}

export class TextOptions extends MouseOptions {
    text?: Konva.Text;

    constructor() {
        super();
        this.text = new Konva.Text();
    }
}

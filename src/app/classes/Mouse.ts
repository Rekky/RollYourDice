import Konva from 'konva';
import {Coords} from './Coords';

export class Mouse {
    isActive: boolean;
    stage: Konva.Stage;
    layer: Konva.Layer;
    state: string;
    ev: MouseEvent;

    constructor(stage?: Konva.Stage, layer?: Konva.Layer, ev?: MouseEvent, isActive?: boolean) {
        this.isActive = isActive ? isActive : false;
        this.stage = stage ? stage : null;
        this.layer = layer ? layer : null;
        this.ev = ev ? ev : null;
    }

    mouseDown(): void | CurrentSelectedObject {}
    mouseMove(): void {}
    mouseUp(): void {}
    mouseOut(): void {}
}

export class Pointer extends Mouse {
    state: string = 'pointer';
    startCoords: Coords;
    offsetCoords: Coords;

    constructor() {
        super();
        this.startCoords = new Coords();
        this.offsetCoords = new Coords();
    }

    mouseDown(): void {
        super.mouseDown();
        this.startCoords.x = this.ev.clientX - this.offsetCoords.x;
        this.startCoords.y = this.ev.clientY - this.offsetCoords.y;
    }

    mouseMove(): void {
        super.mouseMove();
        this.offsetCoords.x = this.ev.clientX - this.startCoords.x;
        this.offsetCoords.y = this.ev.clientY - this.startCoords.y;
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

export class Text extends Mouse {
    state: string = 'text';
    text: Konva.Text;

    constructor() {
        super();
        this.text = new Konva.Text();
    }

    mouseDown(): CurrentSelectedObject {
        super.mouseDown();
        const pos = this.stage.getPointerPosition();
        this.text = new Konva.Text({
            text: 'Some text here',
            x: pos.x,
            y: pos.y,
            fontSize: 20,
            draggable: true,
            width: 200,
        });

        const transformer = new Konva.Transformer({
            nodes: [this.text],
            enabledAnchors: ['middle-left', 'middle-right'],
            boundBoxFunc: (oldBox, newBox) => {
                newBox.width = Math.max(30, newBox.width);
                return newBox;
            },
        });

        this.text.on('transform', () => {
            this.text.setAttrs({
                width: Math.max(this.text.width() * this.text.scaleX(), 30),
                scaleX: 1,
                scaleY: 1,
            });
        });

        // EVENTS FOR TEXT
        this.text.on('click', () => {
            transformer.show();
            this.layer.batchDraw();
        });

        this.text.on('dblclick', () => {
            this.text.hide();
            // transformer.hide();

            const textPosition = this.text.absolutePosition();
            const stageBox = this.stage.container().getBoundingClientRect();
            const areaPosition = {
                x: stageBox.left + textPosition.x,
                y: stageBox.top + textPosition.y,
            };

            const textarea = document.createElement('textarea');
            document.body.appendChild(textarea);
            textarea.value = this.text.text();
            textarea.style.position = 'absolute';
            textarea.style.top = areaPosition.y + 'px';
            textarea.style.left = areaPosition.x + 'px';
            textarea.style.width = this.text.width() - this.text.padding() * 2 + 'px';
            textarea.style.height = this.text.height() - this.text.padding() * 2 + 5 + 'px';
            textarea.style.fontSize = this.text.fontSize() + 'px';
            textarea.style.border = 'none';
            textarea.style.padding = '0px';
            textarea.style.margin = '0px';
            textarea.style.overflow = 'hidden';
            textarea.style.background = 'none';
            textarea.style.outline = 'none';
            textarea.style.resize = 'none';
            textarea.style.fontFamily = this.text.fontFamily();
            textarea.style.transformOrigin = 'left top';
            textarea.style.textAlign = this.text.align();
            textarea.style.color = this.text.fill();
            textarea.focus();

            textarea.addEventListener('keydown', (e: KeyboardEvent) => {
                // hide on enter
                if (e.keyCode === 13) {
                    this.text.text(textarea.value);
                    this.text.show();
                    transformer.hide();
                    this.layer.batchDraw();
                    document.body.removeChild(textarea);
                }
            });
        });

        this.layer.add(this.text);
        this.layer.add(transformer);
        this.layer.batchDraw();

        return new CurrentSelectedObject(transformer, this.text.getAttrs());
    }
}

export class CurrentSelectedObject {
    transformer: Konva.Transformer;
    attr: any;

    constructor(tr: Konva.Transformer, attr: any) {
        this.transformer = tr;
        this.attr = attr;
    }
}

import Konva from 'konva';
import {CurrentSelectedObject, Mouse} from './Mouse';
import {Grid} from './Grid';
import {Coords} from './Coords';

export class Text extends Mouse {
    state: string = 'text';

    constructor() {
        super();
    }

    mouseDown(): CurrentSelectedObject {
        super.mouseDown();
        const pos = this.stage.getPointerPosition();
        const text = new Konva.Text({
            text: 'Some text here',
            x: pos.x,
            y: pos.y,
            fontSize: 20,
            draggable: true,
            width: 200,
        });

        const transformer = new Konva.Transformer({
            nodes: [text],
            enabledAnchors: ['middle-left', 'middle-right'],
            boundBoxFunc: (oldBox, newBox) => {
                newBox.width = Math.max(30, newBox.width);
                return newBox;
            },
        });

        text.on('transform', () => {
            text.setAttrs({
                width: Math.max(text.width() * text.scaleX(), 30),
                scaleX: 1,
                scaleY: 1,
            });
        });

        // EVENTS FOR TEXT
        text.on('click', () => {
            transformer.show();
            this.layer.batchDraw();
        });

        text.on('dblclick', () => {
            text.hide();
            // transformer.hide();

            const textPosition = text.absolutePosition();
            const stageBox = this.stage.container().getBoundingClientRect();
            const areaPosition = {
                x: stageBox.left + textPosition.x,
                y: stageBox.top + textPosition.y,
            };

            const textarea = document.createElement('textarea');
            document.body.appendChild(textarea);
            textarea.value = text.text();
            textarea.style.position = 'absolute';
            textarea.style.top = areaPosition.y + 'px';
            textarea.style.left = areaPosition.x + 'px';
            textarea.style.width = text.width() - text.padding() * 2 + 'px';
            textarea.style.height = text.height() - text.padding() * 2 + 5 + 'px';
            textarea.style.fontSize = text.fontSize() + 'px';
            textarea.style.border = 'none';
            textarea.style.padding = '0px';
            textarea.style.margin = '0px';
            textarea.style.overflow = 'hidden';
            textarea.style.background = 'none';
            textarea.style.outline = 'none';
            textarea.style.resize = 'none';
            textarea.style.fontFamily = text.fontFamily();
            textarea.style.transformOrigin = 'left top';
            textarea.style.textAlign = text.align();
            textarea.style.color = text.fill();
            textarea.focus();

            textarea.addEventListener('keydown', (e: KeyboardEvent) => {
                // hide on enter
                if (e.keyCode === 13) {
                    text.text(textarea.value);
                    text.show();
                    transformer.hide();
                    this.layer.batchDraw();
                    document.body.removeChild(textarea);
                }
            });
        });
        this.adaptPositionToGrid(text);
        this.layer.add(text);
        this.layer.add(transformer);
        this.layer.batchDraw();

        return new CurrentSelectedObject(transformer, text.getAttrs());
    }
}

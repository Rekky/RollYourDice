import Konva from 'konva';
import {CurrentSelectedKonvaObject, OurKonvaMouse} from './OurKonvaMouse';

export class OurKonvaText extends OurKonvaMouse {
    state: string = 'text';
    color: string;
    fontSize: number;

    constructor() {
        super();
        this.color = '#000000';
        this.fontSize = 20;
    }

    mouseDown(): CurrentSelectedKonvaObject {
        super.mouseDown();
        const pos = this.stage.getPointerPosition();
        const text = new Konva.Text({
            text: 'Some text here',
            x: pos.x,
            y: pos.y,
            fontSize: this.fontSize,
            draggable: true,
            width: 200,
            fill: this.color
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
            this.layers.texts.batchDraw();
        });

        text.on('dblclick', () => {
            let editing = false;
            text.hide();
            transformer.hide();

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
            editing = true;

            textarea.addEventListener('keydown', (e: KeyboardEvent) => {
                // hide on enter
                if (e.keyCode === 13) {
                    text.text(textarea.value);
                    text.show();
                    transformer.hide();
                    this.layers.texts.batchDraw();
                    editing = false;
                    document.body.removeChild(textarea);
                }
                // on esc do not set value back to node
                if (e.keyCode === 27) {
                    text.show();
                    transformer.hide();
                    this.layers.texts.batchDraw();
                    editing = false;
                    document.body.removeChild(textarea);
                }
            });

            setTimeout(() => {
                window.addEventListener('click', (e: MouseEvent) => {
                    if (editing && e.target !== textarea) {
                        text.text(textarea.value);
                        text.show();
                        transformer.hide();
                        this.layers.texts.batchDraw();
                        editing = false;
                        document.body.removeChild(textarea);
                    }
                }, { once: true });
            }, 500);
        });

        this.adaptPositionToGrid(text);
        this.layers.texts.add(text);
        this.layers.texts.add(transformer);
        this.layers.texts.batchDraw();

        return new CurrentSelectedKonvaObject(transformer, text.getAttrs());
    }
}

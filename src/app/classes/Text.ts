import Konva from 'konva';
import {CurrentSelectedObject, Mouse} from './Mouse';

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

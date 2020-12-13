import Konva from 'konva';
import {CurrentSelectedKonvaObject, OurKonvaMouse} from './OurKonvaMouse';
import {OurKonvaLayers} from './OurKonvaLayers';
import {Coords} from '../Coords';

export class OurKonvaText extends OurKonvaMouse {
    id: string;
    state: string = 'text';
    color: string;
    fontSize: number;
    text: string;
    position: Coords;

    constructor() {
        super();
        this.color = '#000000';
        this.fontSize = 20;
        this.id = 'text-' + Math.floor(Math.random() * 100000);
        this.text = 'Some text here';
        this.name = 'new text';
        this.position = new Coords();
    }

    static getKonvaText(object: OurKonvaText): Konva.Text {
        return new Konva.Text({
            text: object.text,
            x: object.position.x,
            y: object.position.y,
            fontSize: object.fontSize,
            draggable: false,
            width: object.size.width,
            height: object.size.height,
            fill: object.color,
            id: object.id,
            name: object.name
        });
    }

    static getOurKonvaText(object: Konva.Text): OurKonvaText {
        const text = new OurKonvaText();
        const objectAttrs = object.getAttrs();
        text.position.x = objectAttrs.x;
        text.position.y = objectAttrs.y;
        text.size.height = objectAttrs.height;
        text.size.width = objectAttrs.width;
        text.state = 'text';
        text.color = objectAttrs.fill;
        text.fontSize = objectAttrs.fontSize;
        text.text = objectAttrs.text;
        text.id = objectAttrs.id;
        text.name = objectAttrs.name;
        return text;
    }

    static paint(object: OurKonvaText, layers: OurKonvaLayers): CurrentSelectedKonvaObject {
        const text = new Konva.Text({
            text: object.text,
            x: object.position.x,
            y: object.position.y,
            fontSize: object.fontSize,
            draggable: false,
            width: object.size.width,
            height: object.size.height,
            fill: object.color,
            id: object.id,
            name: this.name
        });

        const transformer = new Konva.Transformer({
            nodes: [text],
            enabledAnchors: ['middle-left', 'middle-right'],
            boundBoxFunc: (oldBox, newBox) => {
                newBox.width = Math.max(30, newBox.width);
                return newBox;
            },
        });
        transformer.id('tr-' + object.id);

        // this.adaptPositionToGrid(text);
        layers.texts.add(text);
        layers.texts.add(transformer);
        layers.texts.batchDraw();

        const toEmit = new CurrentSelectedKonvaObject();
        toEmit.konvaObject = text;
        toEmit.type = object.state;
        toEmit.layer = layers.texts;
        toEmit.transformer = transformer;
        return toEmit;
    }

    mouseDown(): CurrentSelectedKonvaObject {
        super.mouseDown();
        this.id = 'text-' + Math.floor(Math.random() * 100000);
        const pos = this.stage.getPointerPosition();
        const text = new Konva.Text({
            text: 'Some text here',
            x: pos.x,
            y: pos.y,
            fontSize: this.fontSize,
            draggable: false,
            width: this.size.width,
            height: this.size.height,
            fill: this.color,
            id: this.id,
            name: this.name
        });

        this.position.x = pos.x;
        this.position.y = pos.y;

        const transformer = new Konva.Transformer({
            nodes: [text],
            enabledAnchors: ['middle-left', 'middle-right'],
            boundBoxFunc: (oldBox, newBox) => {
                newBox.width = Math.max(30, newBox.width);
                return newBox;
            },
        });
        transformer.id('tr-' + this.id);

        text.on('transform', () => {
            text.setAttrs({
                width: Math.max(text.width() * text.scaleX(), 30),
                scaleX: 1,
                scaleY: 1,
            });
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

        const toEmit = new CurrentSelectedKonvaObject();
        toEmit.konvaObject = text;
        toEmit.type = this.state;
        toEmit.layer = this.layers.texts;
        toEmit.transformer = transformer;
        return toEmit;
    }
}

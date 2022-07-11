import Konva from 'konva';
import {CurrentSelectedKonvaObject, OurKonvaObject} from './OurKonvaObject';
import {OurKonvaLayers} from './OurKonvaLayers';
import {Coords} from '../Coords';
import { ulid } from 'ulid';
import {Player} from '../User';

export class OurKonvaText extends OurKonvaObject {
    id: string;
    state: string = 'text';
    color: string;
    fontSize: number;
    text: string;
    position: Coords;

    constructor(author: Player) {
        super(author);
        this.color = '#000000';
        this.fontSize = 20;
        this.id = ulid();
        this.text = 'Write here...';
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
            // height: object.size.height,
            fill: object.color,
            id: object.id,
            name: object.name
        });
    }

    getOurKonvaText(object: Konva.Text): void {
        const objectAttrs = object.getAttrs();
        this.position.x = objectAttrs.x;
        this.position.y = objectAttrs.y;
        // this.size.height = objectAttrs.height;
        this.size.width = objectAttrs.width;
        this.state = 'text';
        this.color = objectAttrs.fill;
        this.fontSize = objectAttrs.fontSize;
        this.text = objectAttrs.text;
        this.id = objectAttrs.id;
        this.name = objectAttrs.name;
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

    mouseUp(): CurrentSelectedKonvaObject {
        super.mouseDown();
        const pos = this.stage.getPointerPosition();
        const text = new Konva.Text({
            text: 'Some text here',
            x: pos.x,
            y: pos.y,
            fontSize: this.fontSize,
            draggable: false,
            width: this.size.width,
            fill: this.color,
            id: this.id,
            name: this.name,
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
        transformer.hide();

        text.on('transform', () => {
            text.setAttrs({
                width: Math.max(text.width() * text.scaleX(), 30),
                scaleX: 1,
                scaleY: 1,
            });
        });

        this.editMode(text, transformer);

        text.on('dblclick dbltap', () => {
            this.editMode(text, transformer);
        });

        this.refresh(text, transformer);

        const toEmit = new CurrentSelectedKonvaObject();
        toEmit.konvaObject = text;
        toEmit.type = this.state;
        toEmit.layer = this.layers.texts;
        toEmit.transformer = transformer;
        return toEmit;
    }

    refresh(text, transformer): void {
        this.adaptPositionToGrid(text);
        this.layers.texts.add(text);
        this.layers.texts.add(transformer);
        this.layers.texts.batchDraw();
    }

    editMode(text, transformer): void {
        // hide text node and transformer:
        text.hide();
        transformer.hide();

        this.refresh(text, transformer);

        // create textarea over canvas with absolute position
        // first we need to find position for textarea
        // how to find it?

        // at first lets find position of text node relative to the stage:
        const textPosition = text.absolutePosition();

        // so position of textarea will be the sum of positions above:
        const stageBox = this.stage.container().getBoundingClientRect();
        const areaPosition = {
            x: stageBox.left + textPosition.x,
            y: stageBox.top + textPosition.y,
        };
        // const areaPosition = {
        //     x: this.stage.container().offsetLeft + textPosition.x,
        //     y: this.stage.container().offsetTop + textPosition.y,
        // };

        // create textarea and style it
        const textarea = document.createElement('textarea');
        document.body.appendChild(textarea);

        // apply many styles to match text on canvas as close as possible
        // remember that text rendering on canvas and on the textarea can be different
        // and sometimes it is hard to make it 100% the same. But we will try...
        textarea.value = text.text();
        textarea.style.position = 'absolute';
        textarea.style.top = areaPosition.y + 'px';
        textarea.style.left = areaPosition.x + 'px';
        textarea.style.width = text.width() - text.padding() * 2 + 'px';
        textarea.style.height = text.height() - text.padding() * 2 + 5 + 'px';
        textarea.style.fontSize = text.fontSize() + 'px';
        textarea.style.border = 'none';
        textarea.style.padding = '10px';
        textarea.style.margin = '0px';
        textarea.style.overflow = 'hidden';
        textarea.style.outline = 'none';
        textarea.style.resize = 'none';
        textarea.style.fontFamily = text.fontFamily();
        textarea.style.transformOrigin = 'left top';
        textarea.style.textAlign = text.align();
        textarea.style.color = text.fill();

        let transform = '';
        let px = 0;
        // also we need to slightly move textarea on firefox
        // because it jumps a bit
        const isFirefox =
            navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
        if (isFirefox) {
            px += 2 + Math.round(text.fontSize() / 20);
        }
        transform += 'translateY(-' + px + 'px)';

        textarea.style.transform = transform;

        // reset height
        textarea.style.height = 'auto';
        // after browsers resized it we can set actual value
        textarea.style.height = textarea.scrollHeight + 3 + 'px';

        textarea.focus();

        function removeTextarea(): void {
            textarea.parentNode.removeChild(textarea);
            window.removeEventListener('click', e => {
                if (e.target !== textarea) {
                    text.text(textarea.value);
                    removeTextarea();
                }
            });
            text.show();
            transformer.show();
            transformer.forceUpdate();
        }

        function setTextareaWidth(newWidth): void {
            if (!newWidth) {
                // set width for placeholder
                // @ts-ignore
                newWidth = (text as Konva.Text).placeholder.length * text.fontSize();
            }
            // some extra fixes on different browsers
            const isSafari = /^((?!chrome|android).)*safari/i.test(
                navigator.userAgent
            );
            const itIsFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
            if (isSafari || itIsFirefox) {
                newWidth = Math.ceil(newWidth);
            }

            // @ts-ignore
            const isEdge = document.documentMode || /Edge/.test(navigator.userAgent);
            if (isEdge) {
                newWidth += 1;
            }
            textarea.style.width = newWidth + 'px';
        }

        textarea.addEventListener('keydown', (e): void => {
            // hide on enter
            // but don't hide on shift + enter
            if (e.keyCode === 13 && !e.shiftKey) {
                text.text(textarea.value);
                removeTextarea();
            }
            // on esc do not set value back to node
            if (e.keyCode === 27) {
                removeTextarea();
            }

            this.refresh(text, transformer);
        });

        textarea.addEventListener('keydown', (e): void => {
            const scale = text.getAbsoluteScale().x;
            setTextareaWidth(text.width() * scale);
            textarea.style.height = 'auto';
            textarea.style.height = textarea.scrollHeight + text.fontSize() + 'px';
        });

        setTimeout(() => {
            window.addEventListener('click', e => {
                if (e.target !== textarea) {
                    text.text(textarea.value);
                    removeTextarea();
                }
                this.refresh(text, transformer);
            });
        });
    }
}

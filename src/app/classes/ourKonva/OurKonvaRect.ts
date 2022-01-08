import {Coords} from '../Coords';
import Konva from 'konva';
import {CurrentSelectedKonvaObject, OurKonvaMouse} from './OurKonvaMouse';
import {OurKonvaLayers} from './OurKonvaLayers';
import {OurKonvaGrid} from './OurKonvaGrid';
import { ulid } from 'ulid';

export class OurKonvaRect extends OurKonvaMouse {
    id: string;
    position: Coords;
    state: string = 'square';
    tempRect: Konva.Rect;
    fill: string;
    stroke: string;
    strokeWidth: number;
    opacity: number;

    constructor(id?: string, name?: string, position?: Coords) {
        super();
        this.id = ulid();
        this.name = 'new rect';
        this.position = new Coords();
        this.fill = '#ffff00';
        this.stroke = '#000000';
        this.strokeWidth = 1;
        this.opacity = 30;
    }

    static paint(object: OurKonvaRect, layers: OurKonvaLayers): CurrentSelectedKonvaObject {
        const rect = new Konva.Rect({
            x: object.position.x,
            y: object.position.y,
            width: object.size.width,
            height: object.size.height,
            fill: object.fill,
            stroke: object.stroke,
            strokeWidth: object.strokeWidth,
            draggable: false,
            opacity: object.opacity,
            id: object.id,
            name: object.name
        });

        const transformer = new Konva.Transformer();
        layers.draws.add(transformer);
        transformer.nodes([rect]);
        transformer.id('tr-' + object.id);
        transformer.hide();

        layers.draws.add(rect);
        layers.draws.batchDraw();

        const toEmit = new CurrentSelectedKonvaObject();
        toEmit.konvaObject = rect;
        toEmit.type = object.state;
        toEmit.layer = layers.draws;
        toEmit.transformer = transformer;
        return toEmit;
    }

    static getKonvaRect(object: OurKonvaRect): Konva.Rect {
        return new Konva.Rect({
            x: object.position.x,
            y: object.position.y,
            width: object.size.width,
            height: object.size.height,
            fill: object.fill,
            stroke: object.stroke,
            strokeWidth: object.strokeWidth,
            draggable: false,
            opacity: object.opacity / 100,
            id: object.id,
            name: object.name
        });
    }

    static getOurKonvaRect(object: Konva.Rect): OurKonvaRect {
        const rectangle = new OurKonvaRect();
        const objectAttrs = object.getAttrs();
        rectangle.position.x = objectAttrs.x;
        rectangle.position.y = objectAttrs.y;
        rectangle.size.height = objectAttrs.height;
        rectangle.size.width = objectAttrs.width;
        rectangle.state = 'square';
        rectangle.fill = objectAttrs.fill;
        rectangle.stroke = objectAttrs.stroke;
        rectangle.strokeWidth = objectAttrs.strokeWidth;
        rectangle.opacity = objectAttrs.opacity;
        rectangle.id = objectAttrs.id;
        rectangle.name = objectAttrs.name;
        return rectangle;
    }

    mouseDown(): void {
        super.mouseDown();
        this.position = new Coords(this.ev.offsetX, this.ev.offsetY);
    }

    mouseMove(): void {
        // TODO ADAPT ALL MOUSE MOVE as in RECT
        super.mouseMove();
        if (this.isActive) {
            const pos = new Coords(this.ev.offsetX, this.ev.offsetY);
            if (!this.tempRect) {
                this.tempRect = new Konva.Rect({
                    x: this.position.x > pos.x ? pos.x : this.position.x,
                    y: this.position.y > pos.y ? pos.y : this.position.y,
                    width: Math.abs(this.position.x - pos.x),
                    height: Math.abs(this.position.y - pos.y),
                    fill: this.fill,
                    stroke: this.stroke,
                    strokeWidth: this.strokeWidth,
                    draggable: false,
                    opacity: this.opacity / 100,
                    name: this.name
                });
                this.layers.draws.add(this.tempRect);
            } else {
                this.tempRect.setAttr('x', this.position.x > pos.x ? pos.x : this.position.x);
                this.tempRect.setAttr('y', this.position.y > pos.y ? pos.y : this.position.y);
                this.tempRect.setAttr('width', Math.abs(this.position.x - pos.x));
                this.tempRect.setAttr('height', Math.abs(this.position.y - pos.y));
            }
            this.layers.draws.batchDraw();
        }
    }

    mouseUp(): CurrentSelectedKonvaObject {
        super.mouseUp();
        if (this.tempRect) {
            this.tempRect.destroy();
        }
        const pos = new Coords(this.ev.offsetX, this.ev.offsetY);
        const rect = new Konva.Rect({
            x: this.position.x > pos.x ? pos.x : this.position.x,
            y: this.position.y > pos.y ? pos.y : this.position.y,
            width: Math.abs(this.position.x - pos.x),
            height: Math.abs(this.position.y - pos.y),
            fill: this.fill,
            stroke: this.stroke,
            strokeWidth: this.strokeWidth,
            draggable: false,
            opacity: this.opacity / 100,
            id: this.id,
            name: this.name
        });

        this.size.width = Math.abs(this.position.x - pos.x);
        this.size.height = Math.abs(this.position.y - pos.y);
        this.position.x = this.position.x > pos.x ? this.position.x - this.size.width : this.position.x;
        this.position.y = this.position.y > pos.y ? this.position.y - this.size.height : this.position.y;

        const transformer = new Konva.Transformer();
        this.layers.draws.add(transformer);
        transformer.nodes([rect]);
        transformer.id('tr-' + this.id);
        transformer.hide();

        this.layers.draws.add(rect);
        this.layers.draws.batchDraw();

        const toEmit = new CurrentSelectedKonvaObject();
        toEmit.konvaObject = rect;
        toEmit.type = this.state;
        toEmit.layer = this.layers.draws;
        toEmit.transformer = transformer;
        return toEmit;
    }
}

import {Coords} from '../Coords';
import Konva from 'konva';
import {CurrentSelectedKonvaObject, OurKonvaObject} from './OurKonvaObject';
import {OurKonvaLayers} from './OurKonvaLayers';
import { ulid } from 'ulid';
import { Player } from '../User';

export class OurKonvaRect extends OurKonvaObject {
    id: string;
    position: Coords;
    type: string = 'square';
    tempRect: Konva.Rect;
    fill: string;
    stroke: string;
    strokeWidth: number;
    opacity: number;
    strokeScaleEnabled: boolean;

    constructor(author: Player) {
        super(author);
        this.id = ulid();
        this.name = 'new rect';
        this.position = new Coords();
        this.fill = 'rgba(255, 255, 0, 0.3)';
        this.stroke = 'rgba(0, 0, 0, 1)';
        this.strokeWidth = 1;
        this.opacity = 100;
        this.strokeScaleEnabled = false;
    }

    static paint(object: OurKonvaRect, layer: Konva.Layer): CurrentSelectedKonvaObject {
        const rect = new Konva.Rect({
            id: object.id,
            x: object.position.x,
            y: object.position.y,
            width: object.size.width,
            height: object.size.height,
            fill: object.fill,
            stroke: object.stroke,
            strokeWidth: object.strokeWidth,
            draggable: false,
            opacity: object.opacity,
            name: object.name,
            strokeScaleEnabled: false,
        });

        layer.add(rect);
        object.layer = layer;
        layer.batchDraw();

        const toEmit = new CurrentSelectedKonvaObject();
        toEmit.ourKonvaObject = object;
        toEmit.konvaObject = rect;
        toEmit.type = object.type;
        toEmit.layer = layer;
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
            draggable: !object.isEditionBlocked,
            opacity: object.opacity / 100,
            id: object.id,
            name: object.name,
            strokeScaleEnabled: false
        });
    }

     public getOurKonvaRect(object: Konva.Rect): void {
        const objectAttrs = object.getAttrs();
        this.position.x = objectAttrs.x;
        this.position.y = objectAttrs.y;
        this.size.height = objectAttrs.height;
        this.size.width = objectAttrs.width;
        this.type = 'square';
        this.fill = objectAttrs.fill;
        this.stroke = objectAttrs.stroke;
        this.strokeWidth = objectAttrs.strokeWidth;
        this.opacity = objectAttrs.opacity;
        this.id = objectAttrs.id;
        this.name = objectAttrs.name;
        this.strokeScaleEnabled = objectAttrs.false;
    }

    mouseDown(layers: OurKonvaLayers): void {
        super.mouseDown(layers);
        this.layer = layers.draws;
        this.position = new Coords(this.stage.getRelativePointerPosition().x, this.stage.getRelativePointerPosition().y);
    }

    mouseMove(): void {
        super.mouseMove();
        if (this.isActive) {
            const pos = new Coords(this.stage.getRelativePointerPosition().x, this.stage.getRelativePointerPosition().y);
            if (!this.tempRect) {
                this.tempRect = new Konva.Rect({
                    x: this.position.x > pos.x ? pos.x : this.position.x,
                    y: this.position.y > pos.y ? pos.y : this.position.y,
                    width: Math.abs(this.position.x - pos.x),
                    height: Math.abs(this.position.y - pos.y),
                    fill: this.fill,
                    stroke: this.stroke,
                    strokeWidth: this.strokeWidth,
                    draggable: !this.isEditionBlocked,
                    opacity: this.opacity / 100,
                    name: this.name,
                    strokeScaleEnabled: false
                });
                this.layer.add(this.tempRect);
            } else {
                this.tempRect.setAttr('x', this.position.x > pos.x ? pos.x : this.position.x);
                this.tempRect.setAttr('y', this.position.y > pos.y ? pos.y : this.position.y);
                this.tempRect.setAttr('width', Math.abs(this.position.x - pos.x));
                this.tempRect.setAttr('height', Math.abs(this.position.y - pos.y));
            }
            this.layer.batchDraw();
        }
    }

    mouseUp(): CurrentSelectedKonvaObject {
        super.mouseUp();
        if (this.tempRect) {
            this.tempRect.destroy();
        }
        const pos = new Coords(this.stage.getRelativePointerPosition().x, this.stage.getRelativePointerPosition().y);
        const rect = new Konva.Rect({
            x: this.position.x > pos.x ? pos.x : this.position.x,
            y: this.position.y > pos.y ? pos.y : this.position.y,
            width: Math.abs(this.position.x - pos.x),
            height: Math.abs(this.position.y - pos.y),
            fill: this.fill,
            stroke: this.stroke,
            strokeWidth: this.strokeWidth,
            draggable: !this.isEditionBlocked,
            opacity: this.opacity / 100,
            id: this.id,
            name: this.name,
            strokeScaleEnabled: false
        });

        this.size.width = Math.abs(this.position.x - pos.x);
        this.size.height = Math.abs(this.position.y - pos.y);
        this.position.x = this.position.x > pos.x ? this.position.x - this.size.width : this.position.x;
        this.position.y = this.position.y > pos.y ? this.position.y - this.size.height : this.position.y;

        this.layer.add(rect);
        this.layer.batchDraw();

        const toEmit = new CurrentSelectedKonvaObject();
        toEmit.ourKonvaObject = this;
        toEmit.konvaObject = rect;
        toEmit.type = this.type;
        toEmit.layer = this.layer;
        // toEmit.transformer = transformer;
        return toEmit;
    }
}

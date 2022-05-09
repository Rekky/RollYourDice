import {Coords} from '../Coords';
import Konva from 'konva';
import {CurrentSelectedKonvaObject, OurKonvaMouse} from './OurKonvaMouse';
import {OurKonvaLayers} from './OurKonvaLayers';
import { ulid } from 'ulid';
import { Player } from '../User';

export class OurKonvaRect extends OurKonvaMouse {
    id: string;
    position: Coords;
    state: string = 'square';
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

    static paint(object: OurKonvaRect, layers: OurKonvaLayers): CurrentSelectedKonvaObject {
        const rect = new Konva.Rect({
            id: object.id,
            x: object.position.x,
            y: object.position.y,
            width: object.size.width,
            height: object.size.height,
            fill: object.fill,
            stroke: object.stroke,
            strokeWidth: object.strokeWidth,
            draggable: !object.isEditionBlocked,
            opacity: object.opacity,
            name: object.name,
            strokeScaleEnabled: false
        });

        const transformer = new Konva.Transformer({
            rotateAnchorOffset: 120,
            padding: 10,
            anchorCornerRadius: 20
        });

        layers.draws.add(transformer);
        transformer.nodes([rect]);
        transformer.id('tr-' + object.id);
        transformer.enabledAnchors();
        transformer.hide();

        layers.draws.add(rect);
        layers.draws.batchDraw();

        const toEmit = new CurrentSelectedKonvaObject();
        toEmit.ourKonvaObject = object;
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
        this.state = 'square';
        this.fill = objectAttrs.fill;
        this.stroke = objectAttrs.stroke;
        this.strokeWidth = objectAttrs.strokeWidth;
        this.opacity = objectAttrs.opacity;
        this.id = objectAttrs.id;
        this.name = objectAttrs.name;
        this.strokeScaleEnabled = objectAttrs.false;
    }

    mouseDown(): void {
        super.mouseDown();
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

        const transformer = new Konva.Transformer({
            rotateAnchorOffset: 120,
            padding: 10,
            anchorCornerRadius: 20
        });

        this.layers.draws.add(transformer);
        transformer.nodes([rect]);
        transformer.id('tr-' + this.id);
        transformer.hide();

        this.layers.draws.add(rect);
        this.layers.draws.batchDraw();

        const toEmit = new CurrentSelectedKonvaObject();
        toEmit.ourKonvaObject = this;
        toEmit.konvaObject = rect;
        toEmit.type = this.state;
        toEmit.layer = this.layers.draws;
        toEmit.transformer = transformer;
        return toEmit;
    }
}

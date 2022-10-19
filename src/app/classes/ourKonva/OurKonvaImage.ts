import {CurrentSelectedKonvaObject, OurKonvaObject} from './OurKonvaObject';
import Konva from 'konva';
import {Coords} from '../Coords';
import {OurKonvaLayers} from './OurKonvaLayers';
import { ulid } from 'ulid';
import {Player} from '../User';


export class OurKonvaImage extends OurKonvaObject {
    id: string;
    position: Coords;
    tempImage: Konva.Image;
    src: string;
    opacity: number;
    state: 'image';
    isBackground: boolean = false;

    constructor(author: Player, src: string) {
        super(author);
        this.id = ulid();
        this.position = new Coords();
        this.src = src;
        this.opacity = 100;
        this.state = 'image';
        this.name = 'new image';
        this.size.width = 300;
        this.size.height = 300;
    }

    static paint(object: OurKonvaImage, layer: Konva.Layer): CurrentSelectedKonvaObject {
        const image = new Image();
        image.src = object.src;
        const img = new Konva.Image({
            x: object.position.x,
            y: object.position.y,
            image: image,
            draggable: false,
            width: object.size.width,
            height: object.size.height,
            id: object.id,
            name: object.name
        });

        layer.add(img);
        object.layer = layer;
        layer.batchDraw();

        const toEmit = new CurrentSelectedKonvaObject();
        toEmit.ourKonvaObject = object;
        toEmit.konvaObject = img;
        toEmit.type = object.state;
        toEmit.layer = layer;
        return toEmit;
    }

    public getKonvaImage(object: OurKonvaImage): Konva.Image {
        const image = new Image();
        image.src = object.src;
        return new Konva.Image({
            x: object.position.x,
            y: object.position.y,
            image: image,
            draggable: false,
            width: object.size.width,
            height: object.size.height,
            opacity: object.opacity,
            id: object.id,
            name: object.name
        });
    }

    public getOurKonvaImage(object: Konva.Image): void {
        const objectAttrs = object.getAttrs();
        this.position.x = objectAttrs.x;
        this.position.y = objectAttrs.y;
        this.size.height = objectAttrs.height;
        this.size.width = objectAttrs.width;
        this.state = 'image';
        this.opacity = objectAttrs.opacity;
        this.src = objectAttrs.src;
        this.id = objectAttrs.id;
        this.name = objectAttrs.name;
    }

    mouseDown(layers: OurKonvaLayers): void {
        super.mouseDown(layers);
        this.layer = layers.draws;
        this.position = new Coords(this.ev.offsetX, this.ev.offsetY);
    }

    mouseMove(): void {
        super.mouseMove();
        if (this.isActive) {
            const pos = new Coords(this.ev.offsetX, this.ev.offsetY);
            const image = new Image();
            image.src = this.src;
            if (!this.tempImage) {
                this.tempImage = new Konva.Image({
                    x: this.position.x > pos.x ? pos.x : this.position.x,
                    y: this.position.y > pos.y ? pos.y : this.position.y,
                    width: Math.abs(this.position.x - pos.x),
                    height: Math.abs(this.position.y - pos.y),
                    image: image,
                    draggable: false,
                    opacity: this.opacity / 100,
                    name: this.name
                });
                this.layer.add(this.tempImage);
            } else {
                this.tempImage.setAttr('x', this.position.x > pos.x ? pos.x : this.position.x);
                this.tempImage.setAttr('y', this.position.y > pos.y ? pos.y : this.position.y);
                this.tempImage.setAttr('width', Math.abs(this.position.x - pos.x));
                this.tempImage.setAttr('height', Math.abs(this.position.y - pos.y));
            }
            this.layer.batchDraw();
        }
    }

    mouseUp(): CurrentSelectedKonvaObject {
        super.mouseUp();
        if (this.tempImage) {
            this.tempImage.destroy();
        }
        const pos = new Coords(this.ev.offsetX, this.ev.offsetY);
        const image = new Image();
        image.src = this.src;
        const img = new Konva.Image({
            x: this.position.x > pos.x ? pos.x : this.position.x,
            y: this.position.y > pos.y ? pos.y : this.position.y,
            width: Math.abs(this.position.x - pos.x),
            height: Math.abs(this.position.y - pos.y),
            image: image,
            draggable: false,
            opacity: this.opacity / 100,
            name: this.name,
            id: this.id
        });

        this.size.width = Math.abs(this.position.x - pos.x);
        this.size.height = Math.abs(this.position.y - pos.y);
        this.position.x = this.position.x > pos.x ? this.position.x - this.size.width : this.position.x;
        this.position.y = this.position.y > pos.y ? this.position.y - this.size.height : this.position.y;

        const transformer = new Konva.Transformer();
        this.layer.add(transformer);
        transformer.nodes([img]);
        transformer.id('tr-' + this.id);
        transformer.hide();

        this.layer.add(img);
        this.layer.batchDraw();

        const toEmit = new CurrentSelectedKonvaObject();
        toEmit.konvaObject = img;
        toEmit.type = this.state;
        toEmit.layer = this.layer;
        toEmit.transformer = transformer;
        return toEmit;
    }
}

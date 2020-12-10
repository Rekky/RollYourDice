import {Coords} from '../Coords';
import Konva from 'konva';
import {CurrentSelectedKonvaObject, OurKonvaMouse} from './OurKonvaMouse';

export class OurKonvaRect extends OurKonvaMouse {
    id: string;
    name: string;
    position: Coords;
    state: string = 'square';
    tempRect: Konva.Rect;
    fillColor: string;
    strokeColor: string;
    strokeSize: number;
    opacity: number;

    constructor(id?: string, name?: string, position?: Coords) {
        super();
        this.id = id ? id : 'rect-' + Math.floor(Math.random() * 100000);
        this.name = name ? name : 'new Object';
        this.position = position ? position : new Coords();
        this.fillColor = '#ffff00';
        this.strokeColor = '#000000';
        this.strokeSize = 1;
        this.opacity = 30;
    }

    static fromJSON(json: any): OurKonvaRect {
        const mapObject = new OurKonvaRect();
        mapObject.id = json.id;
        mapObject.name = json.name;
        mapObject.position = json.position;
        return mapObject;
    }

    mouseDown(): void {
        super.mouseDown();
        this.id = '-' + Math.floor(Math.random() * 100000);
        this.position = new Coords(this.ev.offsetX, this.ev.offsetY);
    }

    mouseMove(): void {
        super.mouseMove();
        if (this.isActive) {
            if (this.tempRect) {
                this.tempRect.destroy();
            }
            const pos = new Coords(this.ev.offsetX, this.ev.offsetY);
            this.tempRect = new Konva.Rect({
                x: this.position.x > pos.x ? pos.x : this.position.x,
                y: this.position.y > pos.y ? pos.y : this.position.y,
                width: Math.abs(this.position.x - pos.x),
                height: Math.abs(this.position.y - pos.y),
                fill: this.fillColor,
                stroke: this.strokeColor,
                strokeWidth: this.strokeSize,
                draggable: true,
                opacity: this.opacity / 100
            });
            this.adaptPositionToGrid(this.tempRect);
            this.layers.draws.add(this.tempRect);
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
            fill: this.fillColor,
            stroke: this.strokeColor,
            strokeWidth: this.strokeSize,
            draggable: true,
            opacity: this.opacity / 100,
            id: 'rect' + this.id
        });

        const transformer = new Konva.Transformer();
        this.layers.draws.add(transformer);
        transformer.nodes([rect]);
        transformer.hide();

        this.adaptPositionToGrid(rect);
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

// export class CurrentSelectedKonvaBrush extends CurrentSelectedKonvaObject {
//     konvaObject: Konva.Rect;
//
//     constructor() {
//         super();
//         this.konvaObject = new Konva.Rect();
//     }
// }

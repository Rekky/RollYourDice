import {Coords} from '../Coords';
import Konva from 'konva';
import {CurrentSelectedKonvaObject, OurKonvaMouse} from './OurKonvaMouse';

export class OurKonvaRect extends OurKonvaMouse {
    id: string;
    name: string;
    position: Coords;
    state: string = 'square';
    tempRect: Konva.Rect;

    constructor(id?: string, name?: string, position?: Coords) {
        super();
        this.id = id ? id : '-' + Math.floor(Math.random() * 1000);
        this.name = name ? name : 'new Object';
        this.position = position ? position : new Coords();
    }

    static fromJSON(json: any): OurKonvaRect {
        const mapObject = new OurKonvaRect();
        mapObject.id = json.id;
        mapObject.name = json.name;
        mapObject.position = json.position;
        return mapObject;
    }

    toJSON(): any {
        const json: any = {};
        json.id = this.id;
        json.name = this.name;
        json.position = this.position;
        return json;
    }

    mouseDown(): void | CurrentSelectedKonvaObject {
        super.mouseDown();
        this.position = new Coords(this.ev.offsetX, this.ev.offsetY);
        console.log(this.ev);
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
                fill: '#d3d',
                stroke: 'black',
                strokeWidth: 1,
                draggable: true,
                opacity: 0.3
            });
            this.adaptPositionToGrid(this.tempRect);
            this.layers.draws.add(this.tempRect);
            this.layers.draws.batchDraw();
        }
    }

    mouseUp(): void | CurrentSelectedKonvaObject {
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
            fill: '#d3d',
            stroke: 'black',
            strokeWidth: 1,
            draggable: true,
            opacity: 0.5
        });
        const transformer = new Konva.Transformer({
            nodes: [rect],
            enabledAnchors: ['middle-left', 'middle-right'],
            boundBoxFunc: (oldBox, newBox) => {
                newBox.width = Math.max(30, newBox.width);
                return newBox;
            },
        });
        this.adaptPositionToGrid(rect);
        this.layers.draws.add(rect);
        this.layers.draws.batchDraw();
        return new CurrentSelectedKonvaObject(transformer, rect.getAttrs());
    }
}

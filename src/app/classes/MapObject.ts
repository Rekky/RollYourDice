import {Coords} from './Coords';
import {CurrentSelectedObject, Mouse} from './Mouse';
import Konva from 'konva';

export class MapObject extends Mouse {
    id: string | number;
    name: string;
    position: Coords;
    type: string;
    object: Konva.Rect;
    state: string = 'square';

    constructor(id?: string | number, name?: string, position?: Coords, type?: string ) {
        super();
        this.id = id ? id : '-' + Math.floor(Math.random() * 1000);
        this.name = name ? name : 'new object';
        this.position = position ? position : new Coords();
        this.type = type ? type : 'object';
    }

    static fromJSON(json: any): MapObject {
        const mapObject = new MapObject();
        mapObject.id = json.id;
        mapObject.name = json.name;
        mapObject.position = json.position;
        mapObject.type = json.type;
        return mapObject;
    }

    toJSON(): any {
        const json: any = {};
        json.id = this.id;
        json.name = this.name;
        json.position = this.position;
        json.type = this.type;
        return json;
    }

    mouseDown(): void | CurrentSelectedObject {
        super.mouseDown();
        const pos = this.stage.getPointerPosition();
        this.object = new Konva.Rect({
            x: pos.x,
            y: pos.y,
            width: 200,
            fill: '#d3d',
            stroke: 'black',
            strokeWidth: 4,
            draggable: true,
            height: 50,
        });
        const transformer = new Konva.Transformer({
            nodes: [this.object],
            enabledAnchors: ['middle-left', 'middle-right'],
            boundBoxFunc: (oldBox, newBox) => {
                newBox.width = Math.max(30, newBox.width);
                return newBox;
            },
        });

        this.layer.add(this.object);
        this.layer.batchDraw();
        return new CurrentSelectedObject(transformer, this.object.getAttrs());
    }
}

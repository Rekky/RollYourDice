import {Coords} from './Coords';
import {CurrentSelectedObject, Mouse} from './Mouse';
import Konva from 'konva';
import {Grid} from './Grid';

export class MapObject extends Mouse {
    id: string | number;
    position: Coords;
    state: string = 'square';

    constructor(id?: string | number, name?: string, position?: Coords, type?: string ) {
        super();
        this.id = id ? id : '-' + Math.floor(Math.random() * 1000);
        this.position = position ? position : new Coords();
    }

    static fromJSON(json: any): MapObject {
        const mapObject = new MapObject();
        mapObject.id = json.id;
        mapObject.position = json.position;
        return mapObject;
    }

    toJSON(): any {
        const json: any = {};
        json.id = this.id;
        json.position = this.position;
        return json;
    }

    mouseDown(): void | CurrentSelectedObject {
        super.mouseDown();
        const pos = this.stage.getPointerPosition();
        const object = new Konva.Rect({
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
            nodes: [object],
            enabledAnchors: ['middle-left', 'middle-right'],
            boundBoxFunc: (oldBox, newBox) => {
                newBox.width = Math.max(30, newBox.width);
                return newBox;
            },
        });
        this.adaptPositionToGrid(object);
        this.layer.add(object);
        this.layer.batchDraw();
        return new CurrentSelectedObject(transformer, object.getAttrs());
    }
}

import {Coords} from '../Coords';
import Konva from 'konva';
import {CurrentSelectedKonvaObject, OurKonvaMouse} from './OurKonvaMouse';

export class OurKonvaObject extends OurKonvaMouse {
    id: string | number;
    name: string;
    position: Coords;
    state: string = 'square';

    constructor(id?: string | number, name?: string, position?: Coords) {
        super();
        this.id = id ? id : '-' + Math.floor(Math.random() * 1000);
        this.name = name ? name : 'new Object';
        this.position = position ? position : new Coords();
    }

    static fromJSON(json: any): OurKonvaObject {
        const mapObject = new OurKonvaObject();
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
        return new CurrentSelectedKonvaObject(transformer, object.getAttrs());
    }
}

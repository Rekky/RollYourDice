import {CurrentSelectedKonvaObject, OurKonvaObject} from './OurKonvaObject';
import Konva from 'konva';
import {Coords} from '../Coords';
import {OurKonvaLayers} from './OurKonvaLayers';
import { ulid } from 'ulid';
import {Player} from '../User';
import {Actor} from '../Actor';


export class OurKonvaActor extends OurKonvaObject {
    id: string;
    position: Coords;
    tempImage: Konva.Image;
    src: string;
    opacity: number;
    state: 'actor';
    type: 'actor';
    hp: number;

    constructor(author: Player, actor: Actor, src: string) {
        super(author);
        this.id = ulid();
        this.position = new Coords();
        this.src = src;
        this.opacity = 100;
        this.state = 'actor';
        this.name = actor.name ? actor.name : 'new actor';
        this.type = 'actor';
        this.size.width = 300;
        this.size.height = 300;
        this.hp = 50;
    }

    static paint(object: OurKonvaActor, layers: OurKonvaLayers): CurrentSelectedKonvaObject {
        const group = new Konva.Group({
            x: 0,
            y: 0,
            width: object.size.width,
            height: object.size.height,
            rotation: 0,
            draggable: true
        });

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
        group.add(img);
        // layers.draws.add(img);

        const actorHP = new Konva.Rect({
            x: object.position.x,
            y: object.position.y - 50,
            width: object.size.width,
            height: 20,
            fill: '#4caf50',
            stroke: '#333',
            strokeWidth: 1,
            draggable: false,
        });
        group.add(actorHP);
        // layers.draws.add(actorHP);

        const actorName = new Konva.Text({
            x: object.position.x,
            y: object.position.y - 80,
            text: object.name,
            fontSize: 30,
            fill: '#fff',
            align: 'center',
            draggable: false,
        });
        group.add(actorName);
        // layers.draws.add(actorName);
        layers.draws.add(group);
        layers.draws.batchDraw();

        const toEmit = new CurrentSelectedKonvaObject();
        toEmit.ourKonvaObject = object;
        toEmit.konvaObject = img;
        toEmit.type = object.state;
        toEmit.layer = layers.draws;
        return toEmit;
    }

    public getKonvaImage(object: OurKonvaActor): Konva.Image {
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

}

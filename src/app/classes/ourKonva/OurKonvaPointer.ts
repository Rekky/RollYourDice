import {Coords} from '../Coords';
import { OurKonvaObject } from './OurKonvaObject';
import Konva from 'konva';
import { Player } from '../User';
import {OurKonvaLayers} from './OurKonvaLayers';

export class OurKonvaPointer extends OurKonvaObject {
    state: string = 'pointer';
    startCoords: Coords;
    offsetCoords: Coords;
    tempRect: Konva.Rect;
    position: Coords;

    constructor(author?: Player) {
        super(author);
        this.startCoords = new Coords();
        this.offsetCoords = new Coords();
    }

    mouseDown(layers: OurKonvaLayers): void {
        super.mouseDown(layers);
        this.layer = layers.draws;
        this.startCoords.x = this.ev.clientX - this.offsetCoords.x;
        this.startCoords.y = this.ev.clientY - this.offsetCoords.y;
        this.position = new Coords(this.stage.getRelativePointerPosition().x, this.stage.getRelativePointerPosition().y);
    }

    mouseMove(): void {
        super.mouseMove();
        this.offsetCoords.x = this.ev.clientX - this.startCoords.x;
        this.offsetCoords.y = this.ev.clientY - this.startCoords.y;
        if (this.isActive) {
            const pos = new Coords(this.stage.getRelativePointerPosition().x, this.stage.getRelativePointerPosition().y);
            if (!this.tempRect) {
                this.tempRect = new Konva.Rect({
                    x: this.position.x > pos.x ? pos.x : this.position.x,
                    y: this.position.y > pos.y ? pos.y : this.position.y,
                    width: Math.abs(this.position.x - pos.x),
                    height: Math.abs(this.position.y - pos.y),
                    fill: '#5ED5FF',
                    stroke: '#2B95FF',
                    strokeWidth: 2,
                    draggable: !this.isEditionBlocked,
                    opacity: 50 / 100,
                    name: this.name,
                    strokeScaleEnabled: false,
                    listening: false,
                    dash: [2, 2]
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

    mouseUp(): void {
        super.mouseUp();
        if (this.tempRect) {
            this.tempRect.destroy();
        }
        this.layer.batchDraw();
    }
}

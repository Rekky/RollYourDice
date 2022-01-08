import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {MouseService} from '../../../../services/mouse.service';
import {OurKonvaRect} from '../../../../classes/ourKonva/OurKonvaRect';
import {MouseInteractor} from '../../../../interactors/MouseInteractor';
import Konva from 'konva';
import {CurrentSelectedKonvaObject} from '../../../../classes/ourKonva/OurKonvaMouse';
import {SocketService} from '../../../../services/socket.service';

@Component({
  selector: 'app-konva-rectangle-properties',
  templateUrl: './konva-rectangle-properties.component.html',
  styleUrls: ['./konva-rectangle-properties.component.scss']
})
export class KonvaRectanglePropertiesComponent implements OnInit, OnDestroy {
    rectangle: OurKonvaRect;
    getMouseObservableSubscription: Subscription;
    getSelectedKonvaObjectSubscription: Subscription;
    konvaRectangle: CurrentSelectedKonvaObject;

    tempValue: any;

    constructor(private mouseService: MouseService,
                private mouseInteractor: MouseInteractor,
                private socketService: SocketService) { }

    ngOnInit(): void {
        this.getMouseObservableSubscription = this.mouseService.getMouseObservable().subscribe(mouse => {
            if (mouse.state === 'square') {
                this.rectangle = mouse;
            }
        });
        this.getSelectedKonvaObjectSubscription = this.mouseInteractor.getSelectedKonvaObjectObservable().subscribe((konva) => {
            if (konva && konva.type === 'square') {
                this.konvaRectangle = konva;
                const konvaAttrs = konva.konvaObject.getAttrs();
                this.rectangle = new OurKonvaRect();
                this.rectangle.fill = konvaAttrs.fill;
                this.rectangle.strokeWidth = konvaAttrs.strokeWidth;
                this.rectangle.stroke = konvaAttrs.stroke;
                this.rectangle.opacity = konvaAttrs.opacity * 100;
                this.rectangle.position.x = konvaAttrs.x;
                this.rectangle.position.y = konvaAttrs.y;
            }
        });
    }

    ngOnDestroy(): void {
        if (this.getMouseObservableSubscription) {
            this.getMouseObservableSubscription.unsubscribe();
        }
        if (this.getSelectedKonvaObjectSubscription) {
            this.getSelectedKonvaObjectSubscription.unsubscribe();
        }
    }

    fillColorModified(ev: string): void {
        this.rectangle.fill = ev;
        this.mouseService.setMouse(this.rectangle);
        if (this.konvaRectangle) {
            this.konvaRectangle.konvaObject.setAttr('fill', ev);
            this.konvaRectangle.layer.batchDraw();
            const ourKonvaRect = OurKonvaRect.getOurKonvaRect(this.konvaRectangle.konvaObject as Konva.Rect);
            this.socketService.sendGameEditMapObject(ourKonvaRect);
        }
    }

    strokeColorModified(ev: string): void {
        this.rectangle.stroke = ev;
        this.mouseService.setMouse(this.rectangle);
        if (this.konvaRectangle) {
            this.konvaRectangle.konvaObject.setAttr('stroke', ev);
            this.konvaRectangle.layer.batchDraw();
            const ourKonvaRect = OurKonvaRect.getOurKonvaRect(this.konvaRectangle.konvaObject as Konva.Rect);
            this.socketService.sendGameEditMapObject(ourKonvaRect);
        }
    }

    modifyTempValue(ev: any): void {
        this.tempValue = ev;
    }

    modifySquare(attr: string): void {
        this.rectangle.position[attr] = this.tempValue;
        this.mouseService.setMouse(this.rectangle);
        if (this.konvaRectangle) {
            if (attr === 'opacity') {
                this.konvaRectangle.konvaObject.setAttr(attr, this.tempValue / 100);
            } else {
                this.konvaRectangle.konvaObject.setAttr(attr, this.tempValue);
            }
            this.konvaRectangle.layer.batchDraw();
            const ourKonvaRect = OurKonvaRect.getOurKonvaRect(this.konvaRectangle.konvaObject as Konva.Rect);
            this.socketService.sendGameEditMapObject(ourKonvaRect);
        }
    }
}

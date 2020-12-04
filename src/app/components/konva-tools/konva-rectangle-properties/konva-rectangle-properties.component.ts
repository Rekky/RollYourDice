import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {MouseService} from '../../../services/mouse.service';
import {OurKonvaRect} from '../../../classes/ourKonva/OurKonvaRect';
import {MouseInteractor} from '../../../interactors/MouseInteractor';
import Konva from 'konva';
import {CurrentSelectedKonvaObject} from '../../../classes/ourKonva/OurKonvaMouse';

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

    constructor(private mouseService: MouseService,
                private mouseInteractor: MouseInteractor) { }

    ngOnInit(): void {
        this.getMouseObservableSubscription = this.mouseService.getMouseObservable().subscribe(mouse => {
            this.rectangle = mouse;
        });
        this.getSelectedKonvaObjectSubscription = this.mouseInteractor.getSelectedKonvaObjectObservable().subscribe((konva) => {
            if (konva && konva.type === 'square') {
                this.konvaRectangle = konva;
                const konvaAttrs = konva.konvaObject.getAttrs();
                this.rectangle.fillColor = konvaAttrs.fill;
                this.rectangle.strokeSize = konvaAttrs.strokeWidth;
                this.rectangle.strokeColor = konvaAttrs.stroke;
                this.rectangle.opacity = konvaAttrs.opacity * 100;
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
        this.rectangle.fillColor = ev;
        this.mouseService.setMouse(this.rectangle);
        if (this.konvaRectangle) {
            this.konvaRectangle.konvaObject.setAttr('fill', ev);
            this.konvaRectangle.layer.batchDraw();
        }
    }

    strokeSizeModified(ev: number): void {
        this.rectangle.strokeSize = ev;
        this.mouseService.setMouse(this.rectangle);
        if (this.konvaRectangle) {
            this.konvaRectangle.konvaObject.setAttr('strokeWidth', ev);
            this.konvaRectangle.layer.batchDraw();
        }
    }

    strokeColorModified(ev: string): void {
        this.rectangle.strokeColor = ev;
        this.mouseService.setMouse(this.rectangle);
        if (this.konvaRectangle) {
            this.konvaRectangle.konvaObject.setAttr('stroke', ev);
            this.konvaRectangle.layer.batchDraw();
        }
    }

    opacityModified(ev: number): void {
        this.rectangle.opacity = ev;
        this.mouseService.setMouse(this.rectangle);
        if (this.konvaRectangle) {
            this.konvaRectangle.konvaObject.setAttr('opacity', ev / 100);
            this.konvaRectangle.layer.batchDraw();
        }
    }
}

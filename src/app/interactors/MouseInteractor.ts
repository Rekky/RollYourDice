import {ElementRef, Injectable, OnDestroy} from '@angular/core';
import {MouseService} from '../services/mouse.service';
import {Mouse} from '../classes/Mouse';
import Konva from 'konva';
import {Map} from '../classes/Map';
import {Subscription} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class MouseInteractor implements OnDestroy {
    mouse: Mouse = new Mouse();
    lastLine: any;
    lastText: any;
    getMouseObservableSubscription: Subscription;
    stage: Konva.Stage;
    layer: Konva.Layer;

    constructor(private mouseService: MouseService) {
        this.getMouseObservableSubscription = this.mouseService.getMouseObservable().subscribe((res) => {
            this.mouse = res;
            this.mouse.stage = this.stage;
            this.mouse.layer = this.layer;
        });
    }

    ngOnDestroy(): void {
        if (this.getMouseObservableSubscription) {
            this.getMouseObservableSubscription.unsubscribe();
        }
    }

    setMouseKonvaParameters(stage: Konva.Stage, layer: Konva.Layer, map?: Map): void {
        this.stage = stage;
        this.layer = layer;
    }

    setMouseEvents(mapEl: ElementRef): void {
        mapEl.nativeElement.addEventListener('mousedown', (e) => {
            this.mouse.isActive = true;
            this.mouse.ev = e;
            const mouseDownReturns = this.mouse.mouseDown();
        }, false);

        mapEl.nativeElement.addEventListener('mousemove', (e) => {
            this.mouse.ev = e;
            this.mouse.mouseMove();
        }, false);

        mapEl.nativeElement.addEventListener('mouseup', (e) => {
            this.mouse.isActive = false;
            this.mouse.ev = e;
            this.mouse.mouseUp();
        }, false);
        mapEl.nativeElement.addEventListener('mouseout', (e) => {
            this.mouse.isActive = false;
            this.mouse.ev = e;
            this.mouse.mouseOut();
        }, false);
    }
}

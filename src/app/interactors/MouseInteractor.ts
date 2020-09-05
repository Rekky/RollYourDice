import {ElementRef, Injectable} from '@angular/core';
import {MouseService} from '../services/mouse.service';
import {Mouse, MouseOptions, PaintOptions, TextOptions, PointerOptions} from '../classes/Mouse';
import Konva from 'konva';
import {Map} from '../classes/Map';

@Injectable({
    providedIn: 'root'
})
export class MouseInteractor {
    mouse: Mouse = new Mouse();
    mouseOptions: MouseOptions;
    lastLine: any;
    lastText: any;

    constructor(private mouseService: MouseService) {
        this.mouseService.getMouseObservable().subscribe((res) => {
            this.mouse = res;
        });
    }

    setMouseOptions(stage: Konva.Stage, layer: Konva.Layer, map: Map): void {
        this.mouseOptions = new MouseOptions(stage, layer);
        this.mouseOptions.pointerOptions = new PointerOptions();
        this.mouseOptions.paintOptions = new PaintOptions();
        this.mouseOptions.textOptions = new TextOptions();
        this.mouseOptions.pointerOptions.map = map;
    }

    setMouseEvents(mapEl: ElementRef): void {
        mapEl.nativeElement.addEventListener('mousedown', (e) => {
            this.mouseOptions.isActive = true;
            this.mouseOptions.pointerOptions.ev = e;
            const mouseDownReturns = this.mouse.mouseDown(this.mouseOptions);
            if (mouseDownReturns) {
                this.mouseService.setMouse(mouseDownReturns);
            }
        }, false);

        mapEl.nativeElement.addEventListener('mousemove', (e) => {
            this.mouseOptions.pointerOptions.ev = e;
            this.mouse.mouseMove(this.mouseOptions);
        }, false);

        mapEl.nativeElement.addEventListener('mouseup', (e) => {
            this.mouseOptions.isActive = false;
            this.mouseOptions.pointerOptions.ev = e;
            this.mouse.mouseUp(this.mouseOptions);
        }, false);
        mapEl.nativeElement.addEventListener('mouseout', (e) => {
            this.mouseOptions.isActive = false;
            this.mouseOptions.pointerOptions.ev = e;
            this.mouse.mouseOut(this.mouseOptions);
        }, false);
    }
}

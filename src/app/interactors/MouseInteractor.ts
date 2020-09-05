import {ElementRef, Injectable} from '@angular/core';
import {MouseService} from '../services/mouse.service';
import {Mouse, MouseOptions} from '../classes/Mouse';

@Injectable({
    providedIn: 'root'
})
export class MouseInteractor {
    mouse: Mouse = new Mouse();
    mouseOptions: MouseOptions;

    constructor(private mouseService: MouseService) {
        this.mouseService.getMouseObservable().subscribe((res) => {
            this.mouse = res;
        });
    }

    setMouseEvents(mapEl: ElementRef, mouseOptions: MouseOptions): void {
        this.mouseOptions = mouseOptions;
        mapEl.nativeElement.addEventListener('mousedown', (e) => {
            this.mouseOptions.isActive = true;
            this.mouseOptions.pointerOptions.ev = e;
            this.mouse.mouseDown(mouseOptions);
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

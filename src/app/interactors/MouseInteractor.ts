import {ElementRef, Injectable, OnDestroy} from '@angular/core';
import {MouseService} from '../services/mouse.service';
import Konva from 'konva';
import {BehaviorSubject, Observable, Subscription} from 'rxjs';
import {CurrentSelectedKonvaObject, OurKonvaMouse} from '../classes/ourKonva/OurKonvaMouse';
import {OurKonvaPointer} from '../classes/ourKonva/OurKonvaPointer';
import {OurKonvaMap} from '../classes/ourKonva/OurKonvaMap';
import {OurKonvaLayers} from '../classes/ourKonva/OurKonvaLayers';

@Injectable({
    providedIn: 'root'
})
export class MouseInteractor implements OnDestroy {
    private selectedObject: BehaviorSubject<CurrentSelectedKonvaObject> = new BehaviorSubject<CurrentSelectedKonvaObject>(null);

    mouse: OurKonvaMouse = new OurKonvaMouse();
    getMouseObservableSubscription: Subscription;
    stage: Konva.Stage;
    layers: OurKonvaLayers;

    constructor(private mouseService: MouseService) {
        this.getMouseObservableSubscription = this.mouseService.getMouseObservable().subscribe((res) => {
            this.mouse = res;
            this.mouse.stage = this.stage;
            this.mouse.layers = this.layers;
        });
    }

    ngOnDestroy(): void {
        if (this.getMouseObservableSubscription) {
            this.getMouseObservableSubscription.unsubscribe();
        }
    }

    setMouseKonvaParameters(stage: Konva.Stage, layers: OurKonvaLayers, map?: OurKonvaMap): void {
        this.stage = stage;
        this.layers = layers;
    }

    getCurrentSelectedObjectObservable(): Observable<CurrentSelectedKonvaObject> {
        return this.selectedObject.asObservable();
    }

    setMouseEvents(mapEl: ElementRef): void {
        mapEl.nativeElement.addEventListener('mousedown', (e) => {
            this.mouse.isActive = true;
            this.mouse.ev = e;
            const mouseDownReturns = this.mouse.mouseDown(); // After add a new object the cursor changes to pointer
            if (mouseDownReturns) {
                this.mouseService.setMouse(new OurKonvaPointer());
                this.selectedObject.next(mouseDownReturns);
            }
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

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
    private selectedKonvaObject: BehaviorSubject<CurrentSelectedKonvaObject | null> = new BehaviorSubject<CurrentSelectedKonvaObject | null>(null);

    mouse: OurKonvaMouse = new OurKonvaMouse();
    getMouseObservableSubscription: Subscription;
    stage: Konva.Stage;
    layers: OurKonvaLayers;

    constructor(private mouseService: MouseService) {
        this.getMouseObservableSubscription = this.mouseService.getMouseObservable().subscribe((res) => {
            if (res != null) {
                this.mouse = res;
                this.mouse.stage = this.stage;
                this.mouse.layers = this.layers;
            }
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

    setMouseEvents(mapEl: ElementRef): void {
        mapEl.nativeElement.addEventListener('mousedown', (e) => {
            this.mouse.isActive = true;
            this.mouse.ev = e;
            const konvaElement = this.mouse.mouseDown(); // After add a new object the cursor changes to pointer
            if (konvaElement) {
                this.mouseService.setMouse(new OurKonvaPointer());
                // this.selectedObject.next(konvaElement);
            }
            this.newObjectSelected(konvaElement);
        }, false);

        mapEl.nativeElement.addEventListener('mousemove', (e) => {
            this.mouse.ev = e;
            this.mouse.mouseMove();
        }, false);

        mapEl.nativeElement.addEventListener('mouseup', (e) => {
            this.mouse.isActive = false;
            this.mouse.ev = e;
            const konvaElement = this.mouse.mouseUp();
            this.newObjectSelected(konvaElement);
        }, false);
        mapEl.nativeElement.addEventListener('mouseout', (e) => {
            this.mouse.isActive = false;
            this.mouse.ev = e;
            this.mouse.mouseOut();
        }, false);
    }

    newObjectSelected(object: any): void {
        object?.konvaObject.on('click', () => {
            if (this.selectedKonvaObject?.getValue()?.konvaObject.getAttr('id') !== object?.konvaObject.getAttr('id')) {
                this.selectedKonvaObject?.getValue()?.transformer.hide();
                this.selectedKonvaObject?.getValue()?.layer.batchDraw();
                object?.transformer.show();
                object?.layer.batchDraw();
            }
            this.selectedKonvaObject.next(object);
        });
    }

    getSelectedKonvaObjectObservable(): Observable<CurrentSelectedKonvaObject | null> {
        return this.selectedKonvaObject.asObservable();
    }

    // TODO mirar com eliminar aquesta funció
    getCurrentSelectedObjectObservable(): Observable<CurrentSelectedKonvaObject> {
        return this.selectedObject.asObservable();
    }
}

import {ElementRef, Injectable, OnDestroy} from '@angular/core';
import {MouseService} from '../services/mouse.service';
import Konva from 'konva';
import {BehaviorSubject, Observable, Subscription} from 'rxjs';
import {CurrentSelectedKonvaObject, OurKonvaMouse} from '../classes/ourKonva/OurKonvaMouse';
import {OurKonvaPointer} from '../classes/ourKonva/OurKonvaPointer';
import {OurKonvaMap} from '../classes/ourKonva/OurKonvaMap';
import {OurKonvaLayers} from '../classes/ourKonva/OurKonvaLayers';
import {OurKonvaRect} from '../classes/ourKonva/OurKonvaRect';
import {GameInteractor} from './GameInteractor';
import { Game } from '../classes/Game';
import {Page} from '../classes/Page';
import {OurKonvaText} from '../classes/ourKonva/OurKonvaText';

@Injectable({
    providedIn: 'root'
})
export class MouseInteractor implements OnDestroy {
    private selectedObject: BehaviorSubject<CurrentSelectedKonvaObject> = new BehaviorSubject<CurrentSelectedKonvaObject>(null);
    private selectedKonvaObject: BehaviorSubject<CurrentSelectedKonvaObject | null> = new BehaviorSubject<CurrentSelectedKonvaObject | null>(null);

    mouse: OurKonvaMouse | OurKonvaRect | OurKonvaText = new OurKonvaMouse();
    getMouseObservableSubscription: Subscription;
    getCurrentGameSubscription: Subscription;
    stage: Konva.Stage;
    layers: OurKonvaLayers;
    game: Game | null;

    constructor(private mouseService: MouseService,
                private gameInteractor: GameInteractor) {
        this.getMouseObservableSubscription = this.mouseService.getMouseObservable().subscribe((res) => {
            if (res) {
                this.mouse = res;
            }
        });
        this.getCurrentGameSubscription = this.gameInteractor.getCurrentGame().subscribe((game: Game) => {
            this.game = game;
        });
    }

    ngOnDestroy(): void {
        if (this.getMouseObservableSubscription) {
            this.getMouseObservableSubscription.unsubscribe();
        }
        if (this.getCurrentGameSubscription) {
            this.getCurrentGameSubscription.unsubscribe();
        }
    }

    setMouseEvents(mapEl: ElementRef, map: OurKonvaMap, stage: Konva.Stage, layers: OurKonvaLayers): void {
        mapEl.nativeElement.addEventListener('mousedown', (e) => {
            this.mouse.stage = stage;
            this.mouse.layers = layers;
            this.mouse.isActive = true;
            this.mouse.ev = e;
            const konvaElement = this.mouse.mouseDown(); // After add a new object the cursor changes to pointer
            if (konvaElement) {
                this.mouseService.setMouse(new OurKonvaPointer());
            }
            this.addKonvaObjectToMap(map);
            this.newObjectAddSelectedOption(konvaElement);
        }, false);

        mapEl.nativeElement.addEventListener('mousemove', (e) => {
            this.mouse.ev = e;
            this.mouse.mouseMove();
        }, false);

        mapEl.nativeElement.addEventListener('mouseup', (e) => {
            this.mouse.isActive = false;
            this.mouse.ev = e;
            const konvaElement = this.mouse.mouseUp();
            this.addKonvaObjectToMap(map);
            this.newObjectAddSelectedOption(konvaElement);
        }, false);

        mapEl.nativeElement.addEventListener('mouseout', (e) => {
            this.mouse.isActive = false;
            this.mouse.ev = e;
            this.mouse.mouseOut();
        }, false);
    }

    addKonvaObjectToMap(map: OurKonvaMap): void {
        if (this.mouse.state === 'square') {
            map.objects.push(this.mouse as OurKonvaRect);
        }
        if (this.mouse.state === 'text') {
            map.objects.push(this.mouse as OurKonvaText);
        }
        // TODO depen del que fagi el backend s'haurà de gestionar d'una manera o una altre
        this.game.pages = this.game.pages.map((page: Page) => {
            const mapToModifyIndex = page.maps.findIndex((pageMap: OurKonvaMap) => {
                return pageMap.id === map.id;
            });
            page[mapToModifyIndex] = map;
            return page;
        });
        this.gameInteractor.setCurrentGame(this.game);
    }

    newObjectAddSelectedOption(object: any): void {
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

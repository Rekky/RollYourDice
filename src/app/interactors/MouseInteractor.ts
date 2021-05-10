import {ElementRef, Injectable, OnDestroy} from '@angular/core';
import {MouseService} from '../services/mouse.service';
import Konva from 'konva';
import {BehaviorSubject, Observable, Subscription} from 'rxjs';
import {CurrentSelectedKonvaObject, OurKonvaMouse} from '../classes/ourKonva/OurKonvaMouse';
import {OurKonvaPointer} from '../classes/ourKonva/OurKonvaPointer';
import {OurKonvaMap} from '../classes/ourKonva/OurKonvaMap';
import {OurKonvaLayers} from '../classes/ourKonva/OurKonvaLayers';
import {OurKonvaRect} from '../classes/ourKonva/OurKonvaRect';
import {OurKonvaImage} from '../classes/ourKonva/OurKonvaImage';
import {GameInteractor} from './GameInteractor';
import { Game } from '../classes/Game';
import {Page} from '../classes/Page';
import {OurKonvaText} from '../classes/ourKonva/OurKonvaText';
import {SocketService} from '../services/socket.service';
import {toArray} from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class MouseInteractor implements OnDestroy {
    private selectedObject: BehaviorSubject<CurrentSelectedKonvaObject> = new BehaviorSubject<CurrentSelectedKonvaObject>(null);
    private selectedKonvaObject: BehaviorSubject<CurrentSelectedKonvaObject | null> = new BehaviorSubject<CurrentSelectedKonvaObject | null>(null);

    mouse: OurKonvaMouse | OurKonvaRect | OurKonvaText | OurKonvaImage = new OurKonvaMouse();
    getMouseObservableSubscription: Subscription;
    getCurrentGameSubscription: Subscription;
    stage: Konva.Stage;
    layers: OurKonvaLayers;
    game: Game | null;

    constructor(private mouseService: MouseService,
                private gameInteractor: GameInteractor,
                private socketService: SocketService) {
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
            const konvaElement = this.mouse.mouseDown();
            if (this.mouse.state !== 'pointer') {
                this.selectedObject.next(null);
            }
            if (konvaElement) {
                // this.mouseService.setMouse(new OurKonvaPointer());
                if (this.mouse.state === 'text') {
                    // const ourKonvaElement = OurKonvaText.getOurKonvaText(konvaElement.konvaObject as Konva.Text);
                    // this.addKonvaObjectToMap(ourKonvaElement, map);
                }
                this.newObjectAddSelectedOption(konvaElement, map.id);
            }
        }, false);

        mapEl.nativeElement.addEventListener('mousemove', (e) => {
            this.mouse.ev = e;
            this.mouse.mouseMove();
        }, false);

        mapEl.nativeElement.addEventListener('mouseup', (e) => {
            this.mouse.isActive = false;
            this.mouse.ev = e;
            const konvaElement = this.mouse.mouseUp();
            if (this.mouse.state === 'square') {
                const ourKonvaElement = OurKonvaRect.getOurKonvaRect(konvaElement.konvaObject as Konva.Rect);
                this.addKonvaObjectToMap(ourKonvaElement, map);
            }
            if (this.mouse.state === 'text') {
                const ourKonvaElement = OurKonvaText.getOurKonvaText(konvaElement.konvaObject as Konva.Text);
                this.addKonvaObjectToMap(ourKonvaElement, map);
            }
            if (this.mouse.state === 'image') {
                const ourKonvaElement = OurKonvaImage.getOurKonvaImage(konvaElement.konvaObject as Konva.Image);
                this.addKonvaObjectToMap(ourKonvaElement, map);
            }
            this.newObjectAddSelectedOption(konvaElement, map.id);
        }, false);

        mapEl.nativeElement.addEventListener('mouseout', (e) => {
            this.mouse.isActive = false;
            this.mouse.ev = e;
            this.mouse.mouseOut();
        }, false);
    }

    addKonvaObjectToMap(object: any, map: OurKonvaMap): void {
        if (this.mouse.state === 'square') {
            map.objects.push(this.mouse as OurKonvaRect);
            this.socketService.sendGameCreateMapObject(map.id, this.mouse as OurKonvaRect);
        }
        if (this.mouse.state === 'text') {
            map.objects.push(this.mouse as OurKonvaText);
            this.socketService.sendGameCreateMapObject(map.id, this.mouse as OurKonvaText);
        }
        if (this.mouse.state === 'image') {
            map.objects.push(this.mouse as OurKonvaImage);
            this.socketService.sendGameCreateMapObject(map.id, this.mouse as OurKonvaImage);
        }
        this.mouseService.setMouse(new OurKonvaPointer());
    }

    newObjectAddSelectedOption(object: any, mapId: string): void {
        object?.konvaObject.on('click', () => {
            const target = object.layer.getIntersection(this.stage.getPointerPosition());
            if (this.selectedKonvaObject?.getValue()?.konvaObject.getAttr('id') !== object.konvaObject.getAttr('id')) {
                if (this.selectedKonvaObject && this.selectedKonvaObject.getValue()) {
                    this.selectedKonvaObject.getValue().konvaObject.draggable(false);
                    this.selectedKonvaObject.getValue().transformer.hide();
                    this.selectedKonvaObject.getValue().layer.batchDraw();
                }
                object.konvaObject.draggable(true);
                object.transformer.show();
                object.layer.batchDraw();
            }
            this.selectedKonvaObject.next(object);
        });
        object?.konvaObject.on('dragend', () => {
            if (object.type === 'rect') {
                const ourKonvaRect = OurKonvaRect.getOurKonvaRect(object.konvaObject as Konva.Rect);
                this.socketService.sendGameEditMapObject(ourKonvaRect);
            }
            if (this.mouse.state === 'text') {
                const ourKonvaElement = OurKonvaText.getOurKonvaText(object.konvaObject as Konva.Text);
                this.socketService.sendGameEditMapObject(ourKonvaElement);
            }
            if (this.mouse.state === 'image') {
                const ourKonvaElement = OurKonvaImage.getOurKonvaImage(object.konvaObject as Konva.Image);
                this.socketService.sendGameEditMapObject(ourKonvaElement);
            }
        });
    }

    clickMapObject(object: any): void {
        this.mouseService.setMouse(new OurKonvaPointer());
        const obj = this.stage.find('#' + object.id)[0];
        const childrens = obj.getLayer().getChildren().toArray();
        childrens.forEach(child => {
            const id = child.getAttr('id');
            if (id.startsWith('tr-')) {
                if (id === ('tr-' + obj.getAttr('id'))) {
                    child.show();
                    child.getLayer().batchDraw();
                    const currentSelectedKonvaObject = new CurrentSelectedKonvaObject();
                    if (object.state === 'square') {
                        (obj as Konva.Rect).draggable(true);
                        currentSelectedKonvaObject.konvaObject = obj as Konva.Rect;
                    } else if (object.state === 'image') {
                        (obj as Konva.Image).draggable(true);
                        currentSelectedKonvaObject.konvaObject = obj as Konva.Image;
                    } else if (object.state === 'text') {
                        (obj as Konva.Text).draggable(true);
                        currentSelectedKonvaObject.konvaObject = obj as Konva.Text;
                    }
                    currentSelectedKonvaObject.type = object.state;
                    currentSelectedKonvaObject.layer = child.getLayer();
                    currentSelectedKonvaObject.transformer = child as Konva.Transformer;
                    this.selectedKonvaObject.next(currentSelectedKonvaObject);
                } else {
                    child.hide();
                    child.getLayer().batchDraw();
                }
            } else {
                if (id !== ('tr-' + obj.getAttr('id'))) {
                    if (id !== obj.getAttr('id')) {
                        child.setAttr('draggable', false);
                    }
                }
            }
        });
        this.modifyOtherLayers(obj);
    }

    modifyOtherLayers(obj: any): void {
        const layers = this.stage.getLayers().toArray();
        const getMyLayerIndex = layers.findIndex(layer => {
            return layer.getChildren().toArray().find(child => child.getAttr('id') === obj.getAttr('id'));
        });
        const test = ['hi', 'ho', 'mo'];
        layers.splice(getMyLayerIndex, 1);
        layers.forEach(layer => {
            layer.getChildren().toArray().forEach(child => {
                if (child.getAttr('id').startsWith('tr-')) {
                    child.hide();
                    child.getLayer().batchDraw();
                } else {
                    if (child.getAttr('draggable')) {
                        child.setAttr('draggable', false);
                    }
                }
            });
        });
    }

    setStage(stage: Konva.Stage): void {
        this.stage = stage;
    }

    // setSelectedKonvaObject(object: any): void {
    //     console.log('object =', object);
    //     if (object.state === 'square') {
    //         console.log('ourKonvaRect =', object);
    //         console.log('selectedKonvaObject =', this.selectedKonvaObject.getValue());
    //         // this.selectedKonvaObject.next(ourKonvaRect);
    //     }
    // }

    setSelectedKonvaObject(object: CurrentSelectedKonvaObject | null): void {
        if (object) {
            if (this.selectedKonvaObject?.getValue()?.konvaObject.getAttr('id') !== object.konvaObject.getAttr('id')) {
                if (this.selectedKonvaObject && this.selectedKonvaObject.getValue()) {
                    this.selectedKonvaObject.getValue().konvaObject.draggable(false);
                    this.selectedKonvaObject.getValue().transformer.hide();
                    this.selectedKonvaObject.getValue().layer.batchDraw();
                }
            }
            object.konvaObject.draggable(true);
            object.transformer.show();
            object.layer.batchDraw();
        } else {
            if (this.selectedKonvaObject && this.selectedKonvaObject.getValue()) {
                this.selectedKonvaObject.getValue().konvaObject.draggable(false);
                this.selectedKonvaObject.getValue().transformer.hide();
                this.selectedKonvaObject.getValue().layer.batchDraw();
            }
        }
        this.selectedKonvaObject.next(object);
    }

    getSelectedKonvaObjectObservable(): Observable<CurrentSelectedKonvaObject | null> {
        return this.selectedKonvaObject.asObservable();
    }

    // TODO mirar com eliminar aquesta funció
    getCurrentSelectedObjectObservable(): Observable<CurrentSelectedKonvaObject> {
        return this.selectedObject.asObservable();
    }
}

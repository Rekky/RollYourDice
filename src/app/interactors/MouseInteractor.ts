import {ElementRef, Injectable, OnDestroy, OnInit} from '@angular/core';
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
    selectedKonvaObjectSubscription: Subscription;
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
        this.selectedKonvaObjectSubscription = this.selectedKonvaObject.subscribe((object: CurrentSelectedKonvaObject) => {
            if (object !== null) {
                document.onkeyup = (ev) => {
                    if (ev.key === 'Delete') {
                        object.transformer.destroy();
                        object.konvaObject.destroy();
                        object.layer.batchDraw();
                        this.selectedKonvaObject.next(null);
                    }
                };
            }
        });
    }

    ngOnDestroy(): void {
        if (this.getMouseObservableSubscription) {
            this.getMouseObservableSubscription.unsubscribe();
        }
        if (this.getCurrentGameSubscription) {
            this.getCurrentGameSubscription.unsubscribe();
        }
        if (this.selectedKonvaObjectSubscription) {
            this.selectedKonvaObjectSubscription.unsubscribe();
        }
    }

    // Serveix per passar tota l'informació que es necessita per saber en quin mapa es troba treballant l'usuari i la referència a aquest
    setMouseEvents(mapEl: ElementRef, map: OurKonvaMap, stage: Konva.Stage, layers: OurKonvaLayers): void {
        // Estableix un listener per saber quan es fa MouseDown en el mapa sobre el que es treballa
        mapEl.nativeElement.addEventListener('mousedown', (e) => {
            // Seteja les propietats del this.mouse amb les del mapa en el que s'està treballant
            this.mouse.stage = stage;
            this.mouse.layers = layers;
            this.mouse.isActive = true;
            this.mouse.ev = e;

            // Si el ratolí no és un punter es deselecciona l'objecte que estigui seleccionat en aquell moment
            if (this.mouse.state !== 'pointer') {
                this.selectedObject.next(null);
            }

            this.mouse.mouseDown(); // Executa la funció mouseDown() que correspongui a l'estat en el que està el ratolí

            // const mouseDown = this.mouse.mouseDown(); // Agafa la funció mouseDown() que correspongui a l'estat en el que està el ratolí
            // if (mouseDown) {
            //     // this.mouseService.setMouse(new OurKonvaPointer());
            //     if (this.mouse.state === 'text') {
            //         // const ourKonvaElement = OurKonvaText.getOurKonvaText(konvaElement.konvaObject as Konva.Text);
            //         // this.addKonvaObjectToMap(ourKonvaElement, map);
            //     }
            //     this.newObjectAddSelectedOption(mouseDown);
            // }
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
            this.newObjectAddSelectedOption(konvaElement);
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
            console.log('1');
            map.objects.push(this.mouse as OurKonvaText);
            this.socketService.sendGameCreateMapObject(map.id, this.mouse as OurKonvaText);
        }
        if (this.mouse.state === 'image') {
            map.objects.push(this.mouse as OurKonvaImage);
            this.socketService.sendGameCreateMapObject(map.id, this.mouse as OurKonvaImage);
        }
        this.mouseService.setMouse(new OurKonvaPointer());
    }

    newObjectAddSelectedOption(object: any): void {
        object?.konvaObject.on('click', () => {
            // const target = object.layer.getIntersection(this.stage.getPointerPosition());
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
            console.log('here =', object);
            this.selectedKonvaObject.next(object);
        });
        object?.konvaObject.on('dragend', () => {
            console.log('¡asdasd =', object.konvaObject.attrs);
            if (object.type === 'square') {
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

    // setSelectedKonvaObject(object: CurrentSelectedKonvaObject | null): void {
    //     if (object) {
    //         if (this.selectedKonvaObject?.getValue()?.konvaObject.getAttr('id') !== object.konvaObject.getAttr('id')) {
    //             if (this.selectedKonvaObject && this.selectedKonvaObject.getValue()) {
    //                 this.selectedKonvaObject.getValue().konvaObject.draggable(false);
    //                 this.selectedKonvaObject.getValue().transformer.hide();
    //                 this.selectedKonvaObject.getValue().layer.batchDraw();
    //             }
    //         }
    //         object.konvaObject.draggable(true);
    //         object.transformer.show();
    //         object.layer.batchDraw();
    //     } else {
    //         if (this.selectedKonvaObject && this.selectedKonvaObject.getValue()) {
    //             this.selectedKonvaObject.getValue().konvaObject.draggable(false);
    //             this.selectedKonvaObject.getValue().transformer.hide();
    //             this.selectedKonvaObject.getValue().layer.batchDraw();
    //         }
    //     }
    //     this.selectedKonvaObject.next(object);
    // }

    unsetSelectedKonvaObject(): void {
        if (this.selectedKonvaObject && this.selectedKonvaObject.getValue()) {
            this.selectedKonvaObject.getValue().konvaObject.draggable(false);
            this.selectedKonvaObject.getValue().transformer.hide();
            this.selectedKonvaObject.getValue().layer.batchDraw();
        }
        this.selectedKonvaObject.next(null);
    }

    getSelectedKonvaObjectObservable(): Observable<CurrentSelectedKonvaObject | null> {
        return this.selectedKonvaObject.asObservable();
    }

    // TODO mirar com eliminar aquesta funció
    getCurrentSelectedObjectObservable(): Observable<CurrentSelectedKonvaObject> {
        return this.selectedObject.asObservable();
    }
}

import {ElementRef, Injectable, OnDestroy, OnInit} from '@angular/core';
import {MouseService} from '../services/mouse.service';
import Konva from 'konva';
import {BehaviorSubject, Observable, Subscription} from 'rxjs';
import {CurrentSelectedKonvaObject, OurKonvaObject} from '../classes/ourKonva/OurKonvaObject';
import {OurKonvaPointer} from '../classes/ourKonva/OurKonvaPointer';
import {OurKonvaMap, OurKonvaMapModification} from '../classes/ourKonva/OurKonvaMap';
import {OurKonvaLayers} from '../classes/ourKonva/OurKonvaLayers';
import {OurKonvaRect} from '../classes/ourKonva/OurKonvaRect';
import {OurKonvaImage} from '../classes/ourKonva/OurKonvaImage';
import {OurKonvaText} from '../classes/ourKonva/OurKonvaText';
import {SocketService} from '../services/socket.service';
import {MapObjectService} from '../services/map-object.service';
import {Coords} from '../classes/Coords';
import {OurKonvaBrush} from '../classes/ourKonva/OurKonvaBrush';
import {AssetModel} from '../classes/AssetModel';
import {UserInteractor} from './UserInteractor';
import {Player} from '../classes/User';
import {MapInteractor} from './MapInteractor';
import {GameInteractor} from './GameInteractor';
import {Actor} from "../classes/Actor";
import {OurKonvaActor} from "../classes/ourKonva/OurKonvaActor";

@Injectable({
    providedIn: 'root'
})
export class MouseInteractor implements OnDestroy {
    private selectedKonvaObjects: BehaviorSubject<CurrentSelectedKonvaObject[]> = new BehaviorSubject<CurrentSelectedKonvaObject[]>([]);

    mouse: OurKonvaObject | OurKonvaRect | OurKonvaText | OurKonvaImage;

    getMouseObservableSubscription: Subscription;
    selectedKonvaObjectSubscription: Subscription;

    stage: Konva.Stage;
    currentMap: OurKonvaMap = null;
    isCtrlKeyPressed: boolean = false;
    mouseIsOverKonvaObjectId: string;
    dragHasStartedOnObject: boolean = false;
    ourLayers: OurKonvaLayers;

    constructor(private mouseService: MouseService,
                private mapObjectService: MapObjectService,
                private socketService: SocketService,
                private mapInteractor: MapInteractor,
                private userInteractor: UserInteractor,
                private gameInteractor: GameInteractor) {
        this.getMouseObservableSubscription = this.mouseService.getMouseObservable().subscribe((res) => {
            if (res) {
                this.mouse = res;
            }
        });
        this.selectedKonvaObjectSubscription = this.getSelectedKonvaObjectObservable().subscribe(
            (selectedObjects: CurrentSelectedKonvaObject[]) => {
            if (selectedObjects) {
                document.onkeyup = (ev) => {
                    if (ev.key === 'Delete' && document.activeElement.tagName !== 'INPUT') {
                        const ourSelectedKonvaObjects = selectedObjects.map(obj => obj.ourKonvaObject);
                        const objectsToDelete = ourSelectedKonvaObjects.map(o => {
                            return this.currentMap.objects.find(mapObject => o.id === mapObject.mapRepresentation.id);
                        });
                        this.socketService.deleteGameObject(this.currentMap.id, objectsToDelete);
                        this.selectedKonvaObjects.next([]);
                    }
                };
            }
        });
    }

    ngOnDestroy(): void {
        if (this.getMouseObservableSubscription) {
            this.getMouseObservableSubscription.unsubscribe();
        }
        if (this.selectedKonvaObjectSubscription) {
            this.selectedKonvaObjectSubscription.unsubscribe();
        }
    }

    setMouseEvents(mapEl: ElementRef, map: OurKonvaMap, stage: Konva.Stage, layers: OurKonvaLayers): void {
        this.currentMap = map;
        this.ourLayers = layers;
        mapEl.nativeElement.addEventListener('mousedown', (e) => {
            this.mouse.stage = stage;
            this.mouse.isActive = true;
            this.mouse.ev = e;

            if (this.mouse.type !== 'pointer') {
                this.selectedKonvaObjects.next([]);
            }

            this.mouse.mouseDown(layers);
            if (this.mouseIsOverKonvaObjectId) {
                this.dragHasStartedOnObject = true;
            }
        }, false);

        mapEl.nativeElement.addEventListener('mousemove', (e) => {
            this.mouse.ev = e;
            if (!this.dragHasStartedOnObject && this.mouse.type === 'pointer' || this.mouse.type !== 'pointer') {
                this.mouse.mouseMove();
            }

            if (this.mouse.isActive && this.mouse.type === 'pointer' && !this.dragHasStartedOnObject) {
                const selectedObjects = this.selectedKonvaObjects.getValue();
                const nodes = selectedGroupTr.getNodes();
                const mapObjects = layers.draws.getChildren();
                const mouse = this.mouse as OurKonvaPointer;
                mapObjects.forEach((object, i) => {
                    const ourKonvaObject = this.currentMap?.objects?.find(obj => obj?.mapRepresentation?.id === object.getAttr('id'));
                    const isObjectSelected = nodes.find(selObj => {
                        return object.getAttr('id') === selObj.getAttr('id');
                    });
                    if (object.getAttr('id') === 'tr-selectedObjects' ||
                        i === mapObjects.length - 1 ||
                        ourKonvaObject?.mapRepresentation.type === 'brush') {
                        return;
                    }
                    if (this.isHitCheck(object, mouse.tempRect) && !isObjectSelected) {
                        selectedGroupTr.nodes(nodes.concat([object]));
                        const toEmit = new CurrentSelectedKonvaObject();
                        object.draggable(!ourKonvaObject.mapRepresentation.isEditionBlocked);
                        toEmit.ourKonvaObject = ourKonvaObject;
                        toEmit.konvaObject = object;
                        toEmit.type = object.getAttr('type');
                        toEmit.layer = layers.draws;
                        selectedObjects.push(toEmit);
                        this.selectedKonvaObjects.next(selectedObjects);
                    }
                    if (!this.isHitCheck(object, mouse.tempRect) && isObjectSelected) {
                        object.draggable(false);
                        const selectObjIndex = nodes.findIndex(selObj => {
                            return object.getAttr('id') === selObj.getAttr('id');
                        });
                        nodes.splice(selectObjIndex, 1);
                        selectedGroupTr.nodes(nodes);

                        const selectKonvaObjIndex = selectedObjects.findIndex(selObj => {
                            return object.getAttr('id') === selObj.ourKonvaObject.id;
                        });
                        selectedObjects.splice(selectKonvaObjIndex, 1);
                        this.selectedKonvaObjects.next(selectedObjects);
                    }
                });
            }
        }, false);

        mapEl.nativeElement.addEventListener('mouseup', (e) => {
            let konvaElement = this.mouse.mouseUp();
            // if (this.mouse.type === 'text') { this.mouse.layer = this.ourLayers.texts; }
            this.mouse.isActive = false;
            this.mouse.ev = e;
            this.dragHasStartedOnObject = false;
            if (this.mouse.type === 'pointer') {
                this.mouseService.setMouse(new OurKonvaPointer());
                return;
            }
            if (this.mouse.type !== 'pointer') {
                if (konvaElement.ourKonvaObject.isAdaptedToGrid) {
                    konvaElement = this.adaptObjectToMap(konvaElement); // Adapt object
                }
                this.addMouseKonvaObjectToMap(konvaElement);
                this.newObjectSetEvents(konvaElement);
            }
        }, false);

        mapEl.nativeElement.addEventListener('mouseout', (e) => {
            this.mouse.isActive = false;
            this.mouse.ev = e;
            this.mouse.mouseOut();
        }, false);

        const selectedGroupTr: Konva.Transformer = layers.draws.getChildren()[0] as Konva.Transformer;
        selectedGroupTr?.moveToTop();
        selectedGroupTr?.on('mouseenter', (ev) => {
            this.mouseIsOverKonvaObjectId = selectedGroupTr.getNodes()[0].getAttr('id');
        });
        selectedGroupTr?.on('mouseleave', (ev) => {
            this.mouseIsOverKonvaObjectId = null;
        });
        selectedGroupTr?.on('transformend', (ev) => {
            const selectedGroup = selectedGroupTr.getNodes();
            const selectedObjects = this.selectedKonvaObjects?.getValue();
            const scale: {scaleX: number, scaleY: number} = {
                scaleX: ev.target.attrs.scaleX,
                scaleY: ev.target.attrs.scaleY
            };
            selectedGroup.forEach(object => {
                let mySelectedObjectReference = selectedObjects.find(obj => obj.ourKonvaObject.id === object.getAttr('id'));

                if (mySelectedObjectReference.ourKonvaObject.type !== 'brush') {
                    const newWidth = Math.round(object.getAttr('width') * scale.scaleX);
                    const newHeight = Math.round(object.getAttr('height') * scale.scaleY);
                    object.setAttr('scaleX', 1);
                    object.setAttr('scaleY', 1);
                    object.setAttr('width', newWidth);
                    object.setAttr('height', newHeight);
                }

                mySelectedObjectReference.konvaObject = object;
                mySelectedObjectReference.ourKonvaObject.scale.x = scale.scaleX;
                mySelectedObjectReference.ourKonvaObject.scale.y = scale.scaleY;

                if (mySelectedObjectReference.ourKonvaObject.isAdaptedToGrid) {
                    mySelectedObjectReference = this.adaptObjectToMap(mySelectedObjectReference); // Adapt object to a grid
                }
            });

            this.selectedKonvaObjects.next(selectedObjects);
            const ourSelectedKonvaObjects = selectedObjects.map(obj => obj.ourKonvaObject);
            const objectsToModify = ourSelectedKonvaObjects.map(o => {
                return this.currentMap.objects.find(mapObjects => o.id === mapObjects.mapRepresentation.id);
            });
            this.socketService.updateGameObjects(this.currentMap.id, objectsToModify);
        });
    }

    isHitCheck(shape1, shape2): boolean{
        const s1 = shape1.getClientRect(); // use this to get bounding rect for shapes other than rectangles.
        const s2 = shape2.getClientRect();

        // corners of shape 1
        const X = s1.x;
        const Y  = s1.y;
        const A = s1.x + s1.width;
        const B = s1.y + s1.height;

        // corners of shape 2
        const X1 = s2.x;
        const A1 = s2.x + s2.width;
        const Y1 = s2.y;
        const B1 = s2.y + s2.height;

        // Simple overlapping rect collision test
        if (A < X1 || A1 < X || B < Y1 || B1 < Y) {
            return false;
        }
        else {
            return true;
        }
    }

    addMouseKonvaObjectToMap(object: CurrentSelectedKonvaObject): void {
        console.log('===addMouseKonvaObjectToMap===', object);
        this.socketService.createGameObject(this.currentMap.id, object.ourKonvaObject);
        this.currentMap.objects.push(object.ourKonvaObject);
        this.mouseService.setMouse(new OurKonvaPointer());
    }

    setCtrlKey(isCtrlKey: boolean): void {
        this.isCtrlKeyPressed = isCtrlKey;
    }

    newObjectSetEvents(object: any): void {
        object?.konvaObject.on('mouseover', (e) => {
            document.body.style.cursor = 'pointer';
            this.mouseIsOverKonvaObjectId = object.ourKonvaObject.id;
        });
        object?.konvaObject.on('mouseout', (e) => {
            this.mouseIsOverKonvaObjectId = null;
            document.body.style.cursor = 'default';
        });
        object?.konvaObject.on('click', () => {
            if (this.mouse.type !== 'pointer') { return; }
            if (object.ourKonvaObject.isEditionBlocked && this.isCtrlKeyPressed) { return; }
            const selectedGroupTr: Konva.Transformer = object.layer.find('#tr-selectedObjects')[0];
            selectedGroupTr?.moveToTop();
            const nodes = selectedGroupTr.getNodes();
            const selectedObjects = this.selectedKonvaObjects?.getValue();

            if (this.isCtrlKeyPressed) {
                const objectAlreadySelectedIndex = selectedObjects?.findIndex((o) => {
                    return o.ourKonvaObject.id === object.ourKonvaObject.id;
                });
                if (objectAlreadySelectedIndex >= 0) {
                    selectedObjects.splice(objectAlreadySelectedIndex, 1);
                    nodes.splice(objectAlreadySelectedIndex, 1);
                    object.layer.add(object.konvaObject);
                    object.konvaObject.draggable(false);
                    selectedGroupTr.nodes(nodes);
                    object.layer.batchDraw();
                    this.selectedKonvaObjects.next(selectedObjects);
                    return;
                }
            }

            if (!this.isCtrlKeyPressed && nodes) {
                const children = [];
                nodes.forEach((o) => {
                    children.push(o);
                    object.layer.add(o);
                    o.draggable(false);
                    selectedObjects.splice(0, 1);
                });
                children.forEach((o) => {
                    nodes.splice(0, 1);
                });
                selectedGroupTr.nodes(nodes);
            }

            if (!object.ourKonvaObject.isEditionBlocked) {
                object.konvaObject.draggable(!object.ourKonvaObject.isEditionBlocked);
            }

            selectedObjects.push(object);
            selectedGroupTr.nodes(nodes.concat([object.konvaObject]));
            object.layer.batchDraw();
            this.selectedKonvaObjects.next(selectedObjects);
        });
        object?.konvaObject.on('dragend', () => {
            if (object.ourKonvaObject.isAdaptedToGrid) {
                object = this.adaptObjectToMap(object);
            } else {
                object.ourKonvaObject.position.x = object.konvaObject.getAttr('x');
                object.ourKonvaObject.position.y = object.konvaObject.getAttr('y');
                object.ourKonvaObject.size.width = object.konvaObject.getAttr('width');
                object.ourKonvaObject.size.height = object.konvaObject.getAttr('height');
            }

            const selectedObjects = this.selectedKonvaObjects?.getValue();
            const amITheLastElement = selectedObjects[selectedObjects.length - 1]?.ourKonvaObject.id === object.ourKonvaObject.id;
            const amIThePreLastElement = selectedObjects[selectedObjects.length - 2]?.ourKonvaObject.id === object.ourKonvaObject.id;
            const isMouseDraggingLastElement = selectedObjects[selectedObjects.length - 1]?.ourKonvaObject.id === this.mouseIsOverKonvaObjectId;

            if (selectedObjects.length > 1 && isMouseDraggingLastElement && amITheLastElement) { return; }

            if (isMouseDraggingLastElement && amIThePreLastElement) {
                const ourSelectedKonvaObjectsPre = selectedObjects.map(obj => obj.ourKonvaObject);
                const objectsToModify = ourSelectedKonvaObjectsPre.map(o => {
                    return this.currentMap.objects.find(mapObject => o.id === mapObject.mapRepresentation?.id);
                });
                this.socketService.updateGameObjects(this.currentMap.id, objectsToModify);
                return;
            }

            if (!amITheLastElement) { return; }

            const ourSelectedKonvaObjects = selectedObjects.map(obj => obj.ourKonvaObject);
            const objectsToModify = ourSelectedKonvaObjects.map(o => {
                return this.currentMap.objects.find(mapObject => o.id === mapObject.mapRepresentation?.id);
            });
            this.socketService.updateGameObjects(this.currentMap.id, objectsToModify);
        });
    }

    setStage(stage: Konva.Stage): void {
        this.stage = stage;
    }

    unsetSelectedKonvaObjects(): void {
        const selectedKonvaObjects = this.selectedKonvaObjects.getValue();

        const selectedGroupTr: Konva.Transformer = this.ourLayers.draws.find('#tr-selectedObjects')[0] as Konva.Transformer;
        if (selectedKonvaObjects.length > 0) {
            selectedKonvaObjects.forEach((selectedKonvaObject) => {
                selectedKonvaObject.konvaObject.draggable(false);
                selectedKonvaObject.layer.batchDraw();
            });
        }
        selectedGroupTr.nodes([]);
        this.selectedKonvaObjects.next([]);
    }

    getSelectedKonvaObjectObservable(): Observable<CurrentSelectedKonvaObject[] | null> {
        return this.selectedKonvaObjects.asObservable();
    }

    paintObjectsOnMap(objects: any): void {
        objects.forEach((object: any) => {
            this.paintObjectOnMap(object);
        });
    }

    paintObjectOnMap(object: any): void {
        if (object?.type === 'square') {
            const createdObject = OurKonvaRect.paint(object, this.ourLayers.draws);
            this.newObjectSetEvents(createdObject);
        }
        if (object?.type === 'text') {
            const createdObject = OurKonvaText.paint(object, this.ourLayers.texts);
            this.newObjectSetEvents(createdObject);
        }
        if (object?.type === 'image') {
            const layer = object.isBackground ? this.ourLayers.background : this.ourLayers.draws;
            const createdObject = OurKonvaImage.paint(object, layer);
            this.newObjectSetEvents(createdObject);
        }
        if (object?.type === 'brush') {
            const createdObject = OurKonvaBrush.paint(object, this.ourLayers.draws);
            this.newObjectSetEvents(createdObject);
        }
        if (object?.type === 'actor') {
            const createdObject = OurKonvaActor.paint(object, this.ourLayers.draws);
            this.newObjectSetEvents(createdObject);
        }
    }

    addImageOnMap(asset: AssetModel): void {
        asset.mapRepresentation = new OurKonvaImage(asset.author, asset?.uri);
        asset.mapRepresentation.position.x = (this.currentMap.nRows * this.currentMap.grid.cellSize / 2);
        asset.mapRepresentation.position.y = (this.currentMap.nColumns * this.currentMap.grid.cellSize / 2);
        let currentObject = new CurrentSelectedKonvaObject();
        currentObject.ourKonvaObject = asset.mapRepresentation;
        currentObject.konvaObject = asset.mapRepresentation.getKonvaImage(asset.mapRepresentation);
        currentObject.type = 'image';
        currentObject.layer = this.ourLayers.draws;
        if (asset.mapRepresentation.isAdaptedToGrid) {
            currentObject = this.adaptObjectToMap(currentObject); // Adapt object
        }
        this.socketService.createGameObject(this.currentMap.id, asset);
        this.currentMap.objects.push(asset);
        this.mouseService.setMouse(new OurKonvaPointer());
        this.newObjectSetEvents(currentObject);
        this.paintObjectOnMap(asset.mapRepresentation);
    }

    addActorOnMap(actor: Actor): void {
        actor.mapRepresentation = new OurKonvaActor(actor.author, actor);
        actor.mapRepresentation.position.x = (this.currentMap.nRows * this.currentMap.grid.cellSize / 2);
        actor.mapRepresentation.position.y = (this.currentMap.nColumns * this.currentMap.grid.cellSize / 2);
        let currentObject = new CurrentSelectedKonvaObject();
        currentObject.ourKonvaObject = actor.mapRepresentation;
        currentObject.konvaObject = actor.mapRepresentation.getKonvaImage(actor.mapRepresentation);
        currentObject.type = 'actor';
        currentObject.layer = this.ourLayers.draws;

        if (actor.mapRepresentation.isAdaptedToGrid) {
            currentObject = this.adaptObjectToMap(currentObject); // Adapt object
        }
        this.socketService.createGameObject(this.currentMap.id, actor);
        this.currentMap.objects.push(actor);
        this.mouseService.setMouse(new OurKonvaPointer());
        this.newObjectSetEvents(currentObject);
        this.paintObjectOnMap(actor.mapRepresentation);
    }

    updateSelectedObject(object: CurrentSelectedKonvaObject[]): void {
        this.selectedKonvaObjects.next(object);
    }

    updateObjectRepresentation(object: any): void {
        const obj = this.currentMap.objects.find(mapObjects => object.id === mapObjects.mapRepresentation.id);
        this.socketService.updateGameObjects(this.currentMap.id, [obj]);
    }

    updateObject(obj: Actor): void {
        this.socketService.updateGameObjects(this.currentMap.id, [obj]);
    }

    updateObjectOnMap(object: OurKonvaObject): void {
        this.deleteObjectOnMap(object);
        this.paintObjectOnMap(object);
        this.unsetSelectedKonvaObjects();
        this.updateObjectRepresentation(object);
    }

    deleteObjectOnMap(selectedObject: any): void {
        const obj = this.stage.find('#' + selectedObject.id)[0];
        obj.destroy();
        selectedObject.layer.batchDraw();
    }

    adaptObjectToMap(obj: CurrentSelectedKonvaObject): CurrentSelectedKonvaObject {
        const position = new Coords();
        position.x = Math.round(obj.konvaObject.getAttr('x') / obj.ourKonvaObject.cellSize) * obj.ourKonvaObject.cellSize;
        position.y = Math.round(obj.konvaObject.getAttr('y') / obj.ourKonvaObject.cellSize) * obj.ourKonvaObject.cellSize;
        const width = Math.round(obj.konvaObject.getAttr('width') / obj.ourKonvaObject.cellSize) * obj.ourKonvaObject.cellSize;
        const height = Math.round(obj.konvaObject.getAttr('height') / obj.ourKonvaObject.cellSize) * obj.ourKonvaObject.cellSize;
        obj.konvaObject.setAttr('x', position.x);
        obj.konvaObject.setAttr('y', position.y);
        obj.konvaObject.setAttr('width', width);
        obj.konvaObject.setAttr('height', height);
        this.stage.batchDraw();

        obj.ourKonvaObject.position.x = position.x;
        obj.ourKonvaObject.position.y = position.y;
        obj.ourKonvaObject.size.width = width;
        obj.ourKonvaObject.size.height = height;
        return obj;
    }

    moveSelectedElementToTop(): void {
        const selectedObject = this.selectedKonvaObjects.getValue()[0];
        selectedObject.konvaObject.moveToTop();
        const index = this.currentMap.objects.findIndex(object => object.id === selectedObject.ourKonvaObject.id);
        this.currentMap.objects.splice(index, 1);
        this.currentMap.objects.push(selectedObject.ourKonvaObject);
        this.socketService.sendGameUpdateMap(this.gameInteractor.getCurrentGame().id, this.currentMap);
    }

    moveSelectedElementToBottom(): void {
        const selectedObject = this.selectedKonvaObjects.getValue()[0];
        selectedObject.konvaObject.moveToBottom();
        const index = this.currentMap.objects.findIndex(object => object.id === selectedObject.ourKonvaObject.id);
        this.currentMap.objects.splice(index, 1);
        this.currentMap.objects.unshift(selectedObject.ourKonvaObject);
        this.socketService.sendGameUpdateMap(this.gameInteractor.getCurrentGame().id, this.currentMap);
    }

    moveSelectedElementUp(): void {
        const selectedObject = this.selectedKonvaObjects.getValue()[0];
        const index = this.currentMap.objects.findIndex(object => object.id === selectedObject.ourKonvaObject.id);
        if (index !== this.currentMap.objects.length - 1) {
            const el = this.currentMap.objects.splice(index, 1)[0];
            selectedObject.konvaObject.moveUp();
            this.currentMap.objects.splice(index + 1, 0, el);
            this.socketService.sendGameUpdateMap(this.gameInteractor.getCurrentGame().id, this.currentMap);
        }
    }

    moveSelectedElementDown(): void {
        const selectedObject = this.selectedKonvaObjects.getValue()[0];
        const index = this.currentMap.objects.findIndex(object => object.id === selectedObject.ourKonvaObject.id);
        if (index !== 0) {
            const el = this.currentMap.objects.splice(index, 1)[0];
            selectedObject.konvaObject.moveDown();
            this.currentMap.objects.splice(index - 1, 0, el);
            this.socketService.sendGameUpdateMap(this.gameInteractor.getCurrentGame().id, this.currentMap);
        }
    }

    setAsBackgroundImage(): void {
        const selectedObject = this.selectedKonvaObjects.getValue()[0];
        (selectedObject.ourKonvaObject as OurKonvaImage).isBackground = true;
        selectedObject.layer = this.ourLayers.background;
        selectedObject.konvaObject.draggable(false);
        this.ourLayers.background.add(selectedObject.konvaObject as Konva.Image);

        const selectedGroupTr: Konva.Transformer = this.ourLayers.draws.find('#tr-selectedObjects')[0] as Konva.Transformer;
        selectedGroupTr.nodes([]);
        this.selectedKonvaObjects.next([]);

        this.ourLayers.background.batchDraw();
        this.ourLayers.grid.batchDraw();
        this.ourLayers.draws.batchDraw();
        this.updateObjectRepresentation(selectedObject.ourKonvaObject);
    }
}

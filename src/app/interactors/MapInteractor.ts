import {Injectable} from '@angular/core';
import {MapService} from '../services/map.service';
import { Coords } from '../classes/Coords';
import {SocketService} from '../services/socket.service';
import {BehaviorSubject, Observable, Subscription} from 'rxjs';
import {OurKonvaLayers} from '../classes/ourKonva/OurKonvaLayers';
import Konva from 'konva';
import {OurKonvaRect} from '../classes/ourKonva/OurKonvaRect';
import {OurKonvaText} from '../classes/ourKonva/OurKonvaText';
import {OurKonvaImage} from '../classes/ourKonva/OurKonvaImage';
import {MouseInteractor} from './MouseInteractor';
import {OurKonvaMap} from '../classes/ourKonva/OurKonvaMap';

@Injectable({
    providedIn: 'root'
})
export class MapInteractor {

    constructor(private mapService: MapService,
                private mouseInteractor: MouseInteractor,
                private socketService: SocketService) {
    }

    setMapPosition(id: string | number, pos: Coords): void {
        this.mapService.setMapPosition(id, pos);
    }

    sendSocketObjectPosition(object: any): void {
        // this.socketService.sendSocketObject(object);
    }

    getSocketObjectPosition(): Observable<any> {
        return this.socketService.gameSocketObjectSubscription;
    }

    paintObjectsOnMap(objects: any, layers: OurKonvaLayers, mapId: string): void {
        objects.forEach((object: any) => {
            this.paintObjectOnMap(object, layers, mapId);
        });
    }

    paintObjectOnMap(object: any, layers: OurKonvaLayers, mapId: string): void {
        if (object.state === 'square') {
            const createdObject = OurKonvaRect.paint(object, layers);
            this.mouseInteractor.newObjectAddSelectedOption(createdObject, mapId);
        }
        else if (object.state === 'text') {
            const createdObject = OurKonvaText.paint(object, layers);
            this.mouseInteractor.newObjectAddSelectedOption(createdObject, mapId);
        }
        else if (object.state === 'image') {
            const createdObject = OurKonvaImage.paint(object, layers);
            this.mouseInteractor.newObjectAddSelectedOption(createdObject, mapId);
        }
    }
}

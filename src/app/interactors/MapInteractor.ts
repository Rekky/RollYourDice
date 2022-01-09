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
import {OurKonvaMap, OurKonvaMapModification} from '../classes/ourKonva/OurKonvaMap';
import {GameInteractor} from './GameInteractor';
import {Game} from '../classes/Game';

@Injectable({
    providedIn: 'root'
})
export class MapInteractor {
    private currentMap: BehaviorSubject<OurKonvaMap | null> = new BehaviorSubject<OurKonvaMap>(null);
    private mapModification: BehaviorSubject<OurKonvaMapModification> = new BehaviorSubject<OurKonvaMapModification>(null);

    constructor(private mapService: MapService) {
    }

    async createMap(gameId: string, map: OurKonvaMap): Promise<OurKonvaMap> {
        return await this.mapService.createNewMap(gameId, map);
    }

    async getAllMaps(gameId: string): Promise<OurKonvaMap[]> {
        return  await this.mapService.getAllMaps(gameId);
    }

    setCurrentMap(map: OurKonvaMap): void {
        this.currentMap.next(map);
    }

    setCurrentMapMod(mod: OurKonvaMapModification): void {
        this.mapModification.next(mod);
    }

    getCurrentMapObs(): Observable<OurKonvaMap> {
        return this.currentMap.asObservable();
    }

    getCurrentMapModificationObs(): Observable<OurKonvaMapModification> {
        return this.mapModification.asObservable();
    }

    getCurrentMap(): OurKonvaMap {
        return this.currentMap.getValue();
    }

    setMapPosition(id: string | number, pos: Coords): void {
        this.mapService.setMapPosition(id, pos);
    }

    deleteObjectFromMap(mod: OurKonvaMapModification): void {
        const map = this.getCurrentMap();
        if (map.id === mod.mapId) {
            const objectIndex = map.objects.findIndex((obj: (OurKonvaRect | OurKonvaText | OurKonvaImage)) => obj.id === mod.objectId);
            if (objectIndex !== -1) {
                map.objects.splice(objectIndex, 1);
                this.setCurrentMap(map);
                this.setCurrentMapMod(mod);
            }
        }
    }
}

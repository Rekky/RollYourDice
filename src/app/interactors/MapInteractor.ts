import {Injectable} from '@angular/core';
import {MapService} from '../services/map.service';
import { Position } from '../classes/Position';

@Injectable({
    providedIn: 'root'
})
export class MapInteractor {

    constructor(private mapService: MapService) {

    }

    setMapPosition(id: string | number, pos: Position): void {
        this.mapService.setMapPosition(id, pos);
    }
}

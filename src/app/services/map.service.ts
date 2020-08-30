import { Injectable } from '@angular/core';
import {ApiService} from './api.service';
import {Coords} from '../classes/Coords';

@Injectable({
  providedIn: 'root'
})
export class MapService {

  constructor(private apiService: ApiService) { }

  setMapPosition(id: string | number, pos: Coords): void {
      // this.apiService.setMapPosition(id, pos.toJSON());
  }
}

import { Injectable } from '@angular/core';
import {ApiService} from './api.service';
import {Position} from '../classes/Position';

@Injectable({
  providedIn: 'root'
})
export class MapService {

  constructor(private apiService: ApiService) { }

  setMapPosition(id: string | number, pos: Position): void {
      // this.apiService.setMapPosition(id, pos.toJSON());
  }
}

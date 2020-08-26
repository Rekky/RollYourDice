import { Injectable } from '@angular/core';
import { Map } from '../interfaces/Map';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor() { }

  getMap(): Map {
    const map: Map = {columns: 150, rows: 150, scale: 1, cellWidth: 40, background: null};
    return map;
  }
}

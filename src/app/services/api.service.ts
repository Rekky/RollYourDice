import { Injectable } from '@angular/core';
import { Map } from '../interfaces/Map';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor() { }

  getGameEditor(): any {
    const map: Map = {columns: 150, rows: 150, scale: 1, cellWidth: 40, background: null};

    const game: any = {
      id: '12312411242',
      pages: [
        {
          id: 'asdasdasd',
          name: 'entrada cueva',
          layers: [
            {type: 'map', content: map},
            {type: 'objects', content: 'aun_por_decidir'},
            {type: 'GM_view', content: 'aun_por decidir'}
            ]
        },
        {
          id: 'qweqweqwe',
          name: 'salida cueva',
          layers: []
        }
      ]
    };

    return game;
  }

  getMap(): Map {
    const map: Map = {columns: 150, rows: 150, scale: 1, cellWidth: 40, background: null};
    return map;
  }
}

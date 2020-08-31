import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ApiService {

    constructor() { }

    getGameEditor(id: string): any {
        const map: any = {id: 'map_id_1', name: 'map-1', grid: {cellSize: 40}, position: {x: 400, y: 200}, columns: 20, rows: 20};
        const map2: any = {id: 'map_id_2', name: 'map-2', grid: {cellSize: 80}, position: {x: 800, y: 600}, columns: 4, rows: 4};

        const page: any = {
            id: 'page_id_1',
            name: 'entrada cueva',
            maps: [map, map2]
        };
        const page2: any = {
            id: 'page_id_2',
            name: 'salida cueva',
            maps: [map2]
        };

        const game: any = {
            id: '12312411242',
            pages: [page, page2],
            selectedPageId: 'page_id_2'
        };
        return game;
    }

    setMapPosition(request: any): any {

    }

}

import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ApiService {

    constructor() { }

    getGameEditor(id: string): any {
        const map: any = {id: '1', name: 'map-1', grid: {cellSize: 40}, position: {x: 400, y: 200}, columns: 20, rows: 20};
        const map2: any = {id: '2', name: 'map-2', grid: {cellSize: 80}, position: {x: 1000, y: 600}, columns: 4, rows: 4};

        const page: any = {
            id: 'page-id-1',
            name: 'entrada cueva',
            maps: [map, map2]
        };
        const page2: any = {
            id: 'page-id-2',
            name: 'salida cueva',
            maps: [map]
        };

        const game: any = {
            id: '12312411242',
            pages: [page, page2],
            selectedPageId: 'page-id-1'
        };
        return game;
    }

    setMapPosition(request: any): any {

    }

}

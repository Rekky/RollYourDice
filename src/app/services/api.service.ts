import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ApiService {

    constructor() { }

    getGameEditor(id: string): any {

        // MONSTERS
        const objects: any = {
            id: '1231231',
            name: 'orco',
            position: {
                x: 100,
                y: 2,
            }
        };
        const objects2: any = {
            id: '1231231',
            name: 'cofre',
            position: {
                x: 200,
                y: 20,
            }
        };

        // MAPS
        const map: any = {id: 'map_id_1', name: 'ourKonva-1', position: {x: 400, y: 200}, grid: {cellSize: 40}, columns: 20, rows: 20, objects: [objects, objects2]};
        const map2: any = {id: 'map_id_2', name: 'ourKonva-2', position: {x: 800, y: 600}, grid: {cellSize: 40}, columns: 4, rows: 4, objects: [objects]};

        // PAGES
        const page: any = {
            id: 'page_id_1',
            name: 'entrada cueva',
            maps: [map, map2]
        };
        const page2: any = {
            id: 'page_id_2',
            name: 'salida cueva',
            maps: [map]
        };

        // GAME
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

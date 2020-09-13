import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ApiService {

    constructor() { }

    getGameEditor(id: string): any {

        // MONSTERS
        const objects: any = {
            id: Math.floor(Math.random() * 1000),
            name: 'orco',
            position: {
                x: 100,
                y: 2,
            }
        };
        const objects2: any = {
            id: Math.floor(Math.random() * 1000),
            name: 'cofre',
            position: {
                x: 200,
                y: 20,
            }
        };

        // MAPS
        const map: any = {id: 'map_id_' + Math.floor(Math.random() * 1000), name: 'ourKonva-' + Math.floor(Math.random() * 1000), position: {x: 400, y: 200}, grid: {cellSize: 40}, columns: 20, rows: 20, objects: [objects, objects2]};
        const map2: any = {id: 'map_id_' + Math.floor(Math.random() * 1000), name: 'ourKonva-' + Math.floor(Math.random() * 1000), position: {x: 1200, y: 700}, grid: {cellSize: 40}, columns: 4, rows: 4, objects: [objects]};
        const map3: any = {id: 'map_id_' + Math.floor(Math.random() * 1000), name: 'ourKonva-' + Math.floor(Math.random() * 1000), position: {x: 1287, y: 10}, grid: {cellSize: 40}, columns: 16, rows: 16, objects: []};

        // PAGES
        const page: any = {
            id: 'page_id_' + Math.floor(Math.random() * 1000),
            name: 'entrada cueva',
            maps: [map, map2, map3]
        };
        const page2: any = {
            id: 'page_id_' + Math.floor(Math.random() * 1000),
            name: 'salida cueva',
            maps: [map]
        };

        // GAME
        const game: any = {
            id: '12312411242',
            pages: [page, page2],
            selectedPageId: page.id
        };
        return game;
    }

    setMapPosition(request: any): any {

    }

}

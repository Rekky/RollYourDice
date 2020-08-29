import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ApiService {

    constructor() { }

    getGameEditor(id: string): any {
        const map: any = {id: '1231231', name: 'teste1', grid: {cellSize: 40}, position: {x: 200, y: 200}};
        const page: any = {
            id: 'page-id-1',
            name: 'entrada cueva',
            maps: [map]
        };
        const page2: any = {
            id: 'page-id-2',
            name: 'salida cueva',
            maps: [map]
        };

        const game: any = {
            id: '12312411242',
            pages: [page, page2]
        };
        return game;
    }

    setMapPosition(request: any): any {

    }

}

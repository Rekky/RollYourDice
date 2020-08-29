import { Injectable } from '@angular/core';
import {ApiService} from './api.service';
import {Game} from '../classes/Game';

@Injectable({
    providedIn: 'root'
})
export class GameService {

    constructor(private apiService: ApiService) { }

    getGameEditor(id: string): Game {
        // console.log(this.apiService.getGameEditor(id));
        // const game = new Game(this.apiService.getGameEditor(id));
        // return game;
        return Game.fromJSON(this.apiService.getGameEditor(id));
    }
}

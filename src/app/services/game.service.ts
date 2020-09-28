import { Injectable } from '@angular/core';
import {ApiService} from './api.service';
import {Game} from '../classes/Game';
import {HttpClient} from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class GameService {

    constructor(private apiService: ApiService, private http: HttpClient) { }

    getGameEditor(id: string): void {
        // console.log(this.apiService.getGameEditor(id));
        // const game = new Game(this.apiService.getGameEditor(id));
        // return game;
        // return Game.fromJSON(this.apiService.getGameEditor(id));
    }

    createGame(game: Game): Promise<any> {
        const body = game;
        return this.http.post(`${this.apiService.API_URL}/game`, body).toPromise();
    }

    getAllGames(): Promise<any> {
        const body = {};
        return this.http.get(`${this.apiService.API_URL}/game/all`, body).toPromise();
    }
}

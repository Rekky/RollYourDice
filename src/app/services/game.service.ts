import { Injectable } from '@angular/core';
import {ApiService} from './api.service';
import {Game} from '../classes/Game';
import {HttpClient, HttpParams} from '@angular/common/http';
import {User} from '../classes/User';

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

    getMyGames(user: User): Promise<any> {
        const params = new HttpParams()
        .set('userId', user.id.toString());
        return this.http.get(`${this.apiService.API_URL}/game/my-games`, {headers: {}, params: params}).toPromise();
    }
}

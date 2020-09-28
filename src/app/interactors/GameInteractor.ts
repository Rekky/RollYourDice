import {Injectable} from '@angular/core';
import {GameService} from '../services/game.service';
import {Game} from '../classes/Game';

@Injectable({
    providedIn: 'root'
})
export class GameInteractor {

    constructor(private gameService: GameService) {

    }

    getGameEditor(id: string): void {
        // return this.gameService.getGameEditor(id);
    }

    async createGame(game: Game): Promise<any> {
        return await this.gameService.createGame(game);
    }

    async getAllGames(): Promise<Game[]> {
        const games = await this.gameService.getAllGames();
        console.log(games);
        return await this.gameService.getAllGames();
    }
}

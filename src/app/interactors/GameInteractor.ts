import {Injectable} from '@angular/core';
import {GameService} from '../services/game.service';
import {Game} from '../classes/Game';

@Injectable({
    providedIn: 'root'
})
export class GameInteractor {

    constructor(private gameService: GameService) {

    }

    getGameEditor(id: string): Game {
        console.log('gameinteractor', this.gameService.getGameEditor(id));
        return this.gameService.getGameEditor(id);
    }
}

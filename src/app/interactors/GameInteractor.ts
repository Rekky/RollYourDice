import {Injectable} from '@angular/core';
import {GameService} from '../services/game.service';
import {Game} from '../classes/Game';
import {Page} from '../classes/Page';
import {UserInteractor} from './UserInteractor';
import {Router} from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class GameInteractor {

    constructor(private gameService: GameService, private userInteractor: UserInteractor, private router: Router) {

    }

    getGameEditor(id: string): void {
        // return this.gameService.getGameEditor(id);
    }

    async createGame(game: Game): Promise<any> {
        return await this.gameService.createGame(game);
    }

    async getAllGames(): Promise<Game[]> {
        return await this.gameService.getAllGames();
    }

    async getMyGames(userId: string): Promise<Game[]> {
        return await this.gameService.getMyGames(userId);
    }

    async createPage(page: Page): Promise<any> {
        return await this.gameService.createPage(page);
    }

    goToTheGame(game): void {
        const currentUser = this.userInteractor.getCurrentUser();

        if (game.author === currentUser.id) {
            this.router.navigate(['/game-editor', game.id]);
        } else {
            this.router.navigate(['/home']);
        }
    }
}

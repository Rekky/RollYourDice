import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {Game, GameStatus} from '../../../classes/Game';
import {Player} from '../../../classes/User';
import {GameService} from '../../../services/game.service';
import {ImageService} from '../../../services/image.service';
import {GameInteractor} from '../../../interactors/GameInteractor';
import {UserInteractor} from '../../../interactors/UserInteractor';

@Injectable({
    providedIn: 'root'
})
export class MyAdventuresInteractor {
    private myAdventures: BehaviorSubject<Game[] | null> = new BehaviorSubject<Game[]>(null);

    constructor(private gameService: GameService,
                private gameInteractor: GameInteractor,
                private userInteractor: UserInteractor,
                private imageService: ImageService) {
    }

    getMyAdventures(): Observable<Game[]> {
        if (!this.myAdventures.getValue()) {
            this.gameInteractor.getMyGames().then(res => {
                this.myAdventures.next(res);
            });
        }
        return this.myAdventures.asObservable();
    }

    addAdventure(gameId: string): any {
        this.gameInteractor.getGame(gameId).then(game => {
            const adventures = this.myAdventures.getValue();
            adventures.push(game);
            this.myAdventures.next(adventures);
        });
    }

    updateGameStatus(data: {gameId: string, status: GameStatus}): void {
        const adventures = this.myAdventures.getValue();
        const advIndex = adventures.findIndex(adv => adv.id === data.gameId);
        adventures[advIndex].status = data.status;
        this.myAdventures.next(adventures);
    }

    updateGamePlayersRequested(data: {gameId: string, player: Player}): void {
        const adventures = this.myAdventures.getValue();
        const advIndex = adventures.findIndex(adv => adv.id === data.gameId);
        adventures[advIndex].playersRequested.push(data.player);
        this.myAdventures.next(adventures);
    }

    acceptGamePlayersRequested(data: {gameId: string}): void {
        const adventures = this.myAdventures.getValue();
        const advIndex = adventures.findIndex(adv => adv.id === data.gameId);
        const currentUser = this.userInteractor.getCurrentUser();
        const playerReqIndex = adventures[advIndex].playersRequested.findIndex(playerReq =>
            playerReq.id === currentUser.id);
        adventures[advIndex].playersRequested.splice(playerReqIndex, 1);
        const player = new Player(currentUser.id, currentUser.username, currentUser.hash);
        adventures[advIndex].players.push(player);
        this.myAdventures.next(adventures);
    }

    declineGamePlayersRequested(data: {gameId: string}): void {
        const adventures = this.myAdventures.getValue();
        const advIndex = adventures.findIndex(adv => adv.id === data.gameId);
        adventures.splice(advIndex, 1);
        this.myAdventures.next(adventures);
    }

    kickGamePlayers(data: {gameId: string, player: Player}): void {
        const adventures = this.myAdventures.getValue();
        const advIndex = adventures.findIndex(adv => adv.id === data.gameId);
        adventures.splice(advIndex, 1);
        this.myAdventures.next(adventures);
    }

    masterAcceptGamePlayersRequested(gameId: string, player: Player): void {
        const adventures = this.myAdventures.getValue();
        const advIndex = adventures.findIndex(adv => adv.id === gameId);
        const playerReqIndex = adventures[advIndex].playersRequested.findIndex(playerReq =>
            playerReq.id === player.id);
        adventures[advIndex].playersRequested.splice(playerReqIndex, 1);
        adventures[advIndex].players.push(player);
        this.myAdventures.next(adventures);
    }

    masterDeclineGamePlayers(gameId: string, player: Player): void {
        const adventures = this.myAdventures.getValue();
        const advIndex = adventures.findIndex(adv => adv.id === gameId);
        const playerReqIndex = adventures[advIndex].playersRequested.findIndex(playerReq =>
            playerReq.id === player.id);
        adventures[advIndex].playersRequested.splice(playerReqIndex, 1);
        this.myAdventures.next(adventures);
    }

    masterKickGamePlayers(gameId: string, player: Player): void {
        const adventures = this.myAdventures.getValue();
        const advIndex = adventures.findIndex(adv => adv.id === gameId);
        const playerIndex = adventures[advIndex].players.findIndex(playerReq =>
            playerReq.id === player.id);
        adventures[advIndex].players.splice(playerIndex, 1);
        this.myAdventures.next(adventures);
    }
}

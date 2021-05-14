import {Component, OnDestroy, OnInit} from '@angular/core';
import {Game} from '../../../classes/Game';
import {GameInteractor} from '../../../interactors/GameInteractor';
import {User} from '../../../classes/User';
import {UserInteractor} from '../../../interactors/UserInteractor';
import {Subscription} from 'rxjs';

@Component({
    selector: 'app-my-adventures',
    templateUrl: './my-adventures.component.html',
    styleUrls: ['./my-adventures.component.scss']
})
export class MyAdventuresComponent implements OnInit, OnDestroy {

    adventures: Game[] = [];
    displayOptions: string = null;
    displayedGameIndex: number = 999999;
    adventuresImages: string[] = [];
    currentUser: User;
    gameToEdit: Game | null = null;

    userSubscription: Subscription;

    constructor(private gameInteractor: GameInteractor,
                private userInteractor: UserInteractor) {
        this.currentUser = this.userInteractor.getCurrentUser();

    }

    async ngOnInit(): Promise<void> {
        try {
            this.adventures = await this.gameInteractor.getMyGames(this.currentUser.id);
        } catch (e) {
            console.log(e);
        }
    }

    ngOnDestroy(): void {
        if (this.userSubscription) {
            this.userSubscription.unsubscribe();
        }
    }

    createNewGame(): void {
        this.gameToEdit = new Game(this.currentUser.id);
        this.displayOptions = null;
    }

    async editGame(adventure: Game, e: Event): Promise<void> {
        this.gameToEdit = adventure;
        this.displayOptions = null;
        e.stopPropagation();
    }

    async deleteGame(adventure: Game, i: number, e: Event): Promise<void> {
        e.stopPropagation();
        try {
            await this.gameInteractor.removeGame(adventure.id);
            this.adventures.splice(i, 1);
            this.displayOptions = null;
        } catch (e) {
            console.log(e);
        }
    }

    async saveGame(game: Game): Promise<void> {
        try {
            if (this.gameToEdit.id) {
                // TODO descomentar un cop funcioni el back
                // await this.gameInteractor.editGame(game);
                const adventureIndex = this.adventures.findIndex((adventure: Game) => {
                    return adventure.id === game.id;
                });
                this.adventures[adventureIndex] = game;
            } else {
                game.id = 'new';
                this.adventures.unshift(game);
                // TODO descomentar un cop funcioni el back
                // this.adventures[this.displayedGameIndex] = await this.gameInteractor.createGame(game);
            }
            this.closeEditGame();
            this.displayOptions = null;
        } catch (e) {
            console.log(e);
        }
    }

    selectDisplayOptions(e: Event, id: string): void {
        this.displayOptions = id;
        e.stopPropagation();
    }

    unselectDisplayOptions(e: Event): void {
        this.displayOptions = null;
        e.stopPropagation();
    }

    loadGame(adventure: Game): void {
        // TODO delelte this code
        adventure.authorId = this.currentUser.id;
        this.gameInteractor.goToTheGame(adventure);
    }

    closeEditGame(): void {
        this.gameToEdit = null;
    }

    // TODO delete this!!!!
    logout(): void {
        this.userInteractor.logout();
    }

}

import {Component, OnDestroy, OnInit} from '@angular/core';
import {Game, GameTypes} from '../../../classes/Game';
import {GameInteractor} from '../../../interactors/GameInteractor';
import {User} from '../../../classes/User';
import {UserInteractor} from '../../../interactors/UserInteractor';
import {Subscription} from 'rxjs';
import {Page} from '../../../classes/Page';
import {Asset} from '../../../classes/Asset';
import {Coords} from '../../../classes/Coords';

@Component({
    selector: 'app-my-adventures',
    templateUrl: './my-adventures.component.html',
    styleUrls: ['./my-adventures.component.scss']
})
export class MyAdventuresComponent implements OnInit, OnDestroy {

    adventures: Game[] = [];
    displayOptions: boolean = false;
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
            this.displayedGameIndex = this.adventures.length > 0 ? 0 : 999999;
            this.updateCarrouselImages();
        } catch (e) {
            console.log(e);
        }
    }

    ngOnDestroy(): void {
        if (this.userSubscription) {
            this.userSubscription.unsubscribe();
        }
    }

    // TODO Fix adventures
    updateCarrouselImages(): void {
        if (this.adventures.length > 0) {
            this.adventuresImages = this.adventures.map(adventure => {
                return adventure.image.uri;
            });
        } else {
            this.displayedGameIndex = 999999;
        }
    }

    createNewGame(): void {
        this.gameToEdit = new Game(this.currentUser.id);
    }

    editGame(): void {
        this.displayOptions = false;
        this.gameToEdit = this.adventures[this.displayedGameIndex];
    }

    deleteGame(): void {
        this.displayOptions = false;
        // TODO send games to backend, if OK continue
        this.adventures.splice(this.displayedGameIndex, 1);
        this.updateCarrouselImages();
    }

    async saveGame(game: Game): Promise<void> {
        // TODO add response as game
        try {
            const newAdventure = await this.gameInteractor.createGame(game);
            if (this.displayedGameIndex === 999999) {
                this.adventures.push(game);
                this.displayedGameIndex = this.adventures.length - 1;
                this.adventures[this.displayedGameIndex] = newAdventure;
            } else {
                this.adventures[this.displayedGameIndex] = game;
            }
            this.gameToEdit = null;
            this.updateCarrouselImages();
        } catch (e) {
            console.log(e);
        }
    }

    closeEditGame(): void {
        this.gameToEdit = null;
    }

    loadGame(): void {
        console.log(this.adventures[this.displayedGameIndex]);
        this.gameInteractor.goToTheGame(this.adventures[this.displayedGameIndex]);
    }

}

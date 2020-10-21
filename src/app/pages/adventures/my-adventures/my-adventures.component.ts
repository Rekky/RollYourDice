import {Component, OnDestroy, OnInit} from '@angular/core';
import {Game} from '../../../classes/Game';
import {GameInteractor} from '../../../interactors/GameInteractor';
import {User} from '../../../classes/User';
import {UserInteractor} from '../../../interactors/UserInteractor';
import {Subscription} from 'rxjs';
import {Router} from '@angular/router';

@Component({
    selector: 'app-my-adventures',
    templateUrl: './my-adventures.component.html',
    styleUrls: ['./my-adventures.component.scss']
})
export class MyAdventuresComponent implements OnInit, OnDestroy {

    adventures: Game[];
    currentUser: User;
    userSubscription: Subscription;

    constructor(private gameInteractor: GameInteractor, private userInteractor: UserInteractor) {
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

    goToTheGame(game: Game): void {
        this.gameInteractor.goToTheGame(game);
    }

}
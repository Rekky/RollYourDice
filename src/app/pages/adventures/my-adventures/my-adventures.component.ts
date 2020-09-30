import { Component, OnInit } from '@angular/core';
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
export class MyAdventuresComponent implements OnInit {

    adventures: Game[];
    currentUser: User;
    userSubscription: Subscription;

    constructor(private gameInteractor: GameInteractor, private userInteractor: UserInteractor) {
        this.userSubscription = this.userInteractor.user.subscribe((user: User) => {
            this.currentUser = user;
        });
    }

    async ngOnInit(): Promise<void> {
        try {
            this.adventures = await this.gameInteractor.getMyGames(this.currentUser);
        } catch (e) {
            console.log(e);
        }
    }

}

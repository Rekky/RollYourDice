import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {GameInteractor} from '../../../interactors/GameInteractor';
import {Game} from '../../../classes/Game';
import {Router} from '@angular/router';
import {UserInteractor} from '../../../interactors/UserInteractor';
import {User} from '../../../classes/User';
import {Subscription} from 'rxjs';

@Component({
    selector: 'app-adventure-new',
    templateUrl: './adventure-new.component.html',
    styleUrls: ['./adventure-new.component.scss']
})
export class AdventureNewComponent implements OnInit, OnDestroy {

    newGameForm: FormGroup;
    userSubscription: Subscription;

    constructor(private gameInteractor: GameInteractor, private router: Router, private userInteractor: UserInteractor) { }

    ngOnInit(): void {
        this.newGameForm = new FormGroup({
            name: new FormControl(null),
            type: new FormControl(null),
        });
    }

    ngOnDestroy(): void {
        if (this.userSubscription) {
            this.userSubscription.unsubscribe();
        }
    }

    async createGame(): Promise<void> {
        const name = this.newGameForm.get('name').value;
        const type = this.newGameForm.get('type').value;

        const user = this.userInteractor.getCurrentUser();
        if (user) {
            console.log('entras');
            const game = new Game();
            game.name = name;
            game.author = user.id;
            game.gameType = type;

            try{
                await this.gameInteractor.createGame(game);
                await this.router.navigate(['/home']);
            } catch (e) {
                console.log(e);
            }
        }

    }

}

import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {GameInteractor} from '../../../interactors/GameInteractor';
import {Game} from '../../../classes/Game';

@Component({
    selector: 'app-adventure-new',
    templateUrl: './adventure-new.component.html',
    styleUrls: ['./adventure-new.component.scss']
})
export class AdventureNewComponent implements OnInit {

    newGameForm: FormGroup;

    constructor(private gameInteractor: GameInteractor) { }

    ngOnInit(): void {
        this.newGameForm = new FormGroup({
            name: new FormControl(null),
            type: new FormControl(null),
        });
    }

    async createGame(): Promise<void> {
        const name = this.newGameForm.get('name').value;
        const type = this.newGameForm.get('type').value;

        const game = new Game();
        game.name = name;

        try{
            await this.gameInteractor.createGame(game);
        } catch (e) {
            console.log(e);
        }
    }

}

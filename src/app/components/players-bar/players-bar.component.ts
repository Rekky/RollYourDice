import {Component, OnInit} from '@angular/core';
import {GameInteractor} from '../../interactors/GameInteractor';
import {Player} from '../../classes/User';

@Component({
    selector: 'app-players-bar',
    templateUrl: './players-bar.component.html',
    styleUrls: ['./players-bar.component.scss']
})
export class PlayersBarComponent implements OnInit {

    public players: Player[] = [];

    constructor(private gameInteractor: GameInteractor) {
        this.players = this.gameInteractor.getCurrentGame().players;
    }

    ngOnInit(): void {
    }

}

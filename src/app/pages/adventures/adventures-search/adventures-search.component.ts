import { Component, OnInit } from '@angular/core';
import {Game} from '../../../classes/Game';
import {GameInteractor} from '../../../interactors/GameInteractor';

@Component({
    selector: 'app-adventures-search',
    templateUrl: './adventures-search.component.html',
    styleUrls: ['./adventures-search.component.scss']
})
export class AdventuresSearchComponent implements OnInit {

    adventures: Game[];

    constructor(private gameInteractor: GameInteractor) { }

    async ngOnInit(): Promise<void> {
        try {
            this.adventures = await this.gameInteractor.getAllGames();
        } catch (e) {
            console.log(e);
        }
    }

}

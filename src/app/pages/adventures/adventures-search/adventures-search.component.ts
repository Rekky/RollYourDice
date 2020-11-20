import { Component, OnInit } from '@angular/core';
import {Game} from '../../../classes/Game';
import {GameInteractor} from '../../../interactors/GameInteractor';
import {Router} from '@angular/router';

@Component({
    selector: 'app-adventures-search',
    templateUrl: './adventures-search.component.html',
    styleUrls: ['./adventures-search.component.scss']
})
export class AdventuresSearchComponent implements OnInit {

    adventures: Game[];

    constructor(private gameInteractor: GameInteractor, private router: Router) { }

    async ngOnInit(): Promise<void> {
        try {
            this.adventures = await this.gameInteractor.getAllGames();
        } catch (e) {
            console.log(e);
        }
    }

    joinAsPlayer(gameId: string): void {
        this.router.navigate(['/game-play/' + gameId]);
    }

}

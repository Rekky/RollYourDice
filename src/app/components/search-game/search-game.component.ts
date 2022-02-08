import {Component, Inject, NgZone, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Game} from '../../classes/Game';
import {GameService} from '../../services/game.service';

@Component({
    selector: 'app-search-game',
    templateUrl: './search-game.component.html',
    styleUrls: ['./search-game.component.scss']
})
export class SearchGameComponent implements OnInit {

    loaded: boolean = false;
    searchGameId: string = '';
    gamesList: Game[];

    constructor(
        private dialogRef: MatDialogRef<Game>,
        private ngZone: NgZone,
        private gameService: GameService
    ) { }

    ngOnInit(): void {
        setTimeout(() => {
            this.loaded = true;
        }, 1000);
    }

    async searchGame(): Promise<void> {
        try {
            this.gamesList = await this.gameService.getGamesByString(this.searchGameId);
        }
        catch (e) {

        }
    }

    closeDialog(): void {
        this.ngZone.run(() => {
            this.dialogRef.close();
        });
    }

}

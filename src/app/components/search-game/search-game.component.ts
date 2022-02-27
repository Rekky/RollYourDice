import {Component, Inject, NgZone, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Game} from '../../classes/Game';
import {GameService} from '../../services/game.service';
import {SocketService} from '../../services/socket.service';

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
        private gameService: GameService,
        private socketService: SocketService
    ) { }

    async ngOnInit(): Promise<void> {
        await this.searchGame();
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

    requestGameAccess(gameId: string, authorId: string): void {
        this.socketService.requestJoinGame(gameId, authorId);
        this.closeDialog();
    }

    closeDialog(): void {
        this.ngZone.run(() => {
            this.dialogRef.close();
        });
    }

}

import {Component, Inject, NgZone, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Game} from '../../classes/Game';
import {GameService} from '../../services/game.service';
import {SocketService} from '../../services/socket.service';
import {FormGroup, UntypedFormControl, UntypedFormGroup, Validators} from '@angular/forms';

@Component({
    selector: 'app-search-game',
    templateUrl: './search-game.component.html',
    styleUrls: ['./search-game.component.scss']
})
export class SearchGameComponent implements OnInit {

    loading: boolean = false;
    gamesList: Game[];
    selectedGame: Game | null = null;
    fgSearch: UntypedFormGroup;

    constructor(
        private dialogRef: MatDialogRef<Game>,
        private ngZone: NgZone,
        private gameService: GameService,
        private socketService: SocketService
    ) {
        this.fgSearch = new UntypedFormGroup({
            search: new UntypedFormControl(null, Validators.required)
        });
    }

    async ngOnInit(): Promise<void> {
        await this.searchGame();
    }

    async searchGame(): Promise<void> {
        try {
            this.loading = true;
            const textToSearch: string = this.fgSearch.get('search').value;
            this.gamesList = await this.gameService.getGamesByString(textToSearch);
        }
        catch (e) {
            console.log(e);
        } finally {
            this.loading = false;
        }
    }

    requestGameAccess(gameId: string, authorId: string): void {
        this.socketService.requestJoinGame(gameId, authorId);
        this.closeDialog({gameId: gameId});
    }

    closeDialog(send?: any): void {
        this.ngZone.run(() => {
            this.dialogRef.close(send);
        });
    }
    selectGame(game: Game): void {
        this.selectedGame = game;
    }

}

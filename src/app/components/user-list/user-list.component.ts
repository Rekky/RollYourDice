import {Component, Inject, NgZone, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Game} from '../../classes/Game';
import {Player} from '../../classes/User';
import {SocketService} from '../../services/socket.service';
import {UntypedFormControl, UntypedFormGroup, Validators} from "@angular/forms";

@Component({
    selector: 'app-user-list',
    templateUrl: './user-list.component.html',
    styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
    players: Player[];
    playersRequest: Player[];
    loading: boolean = false;
    fgSearch: UntypedFormGroup;

    constructor(
        private dialogRef: MatDialogRef<any>,
        private ngZone: NgZone,
        private socketService: SocketService,
        @Inject(MAT_DIALOG_DATA) public data: {players: Player[], playersRequest: Player[], gameId: string, game: Game}
    ) {
        this.fgSearch = new UntypedFormGroup({
            search: new UntypedFormControl(null, Validators.required)
        });
    }

    ngOnInit(): void {
        this.players = this.data.players;
        this.playersRequest = this.data.playersRequest;
        console.log('data', this.data);
    }

    closeDialog(): void {
        this.ngZone.run(() => {
            this.dialogRef.close();
        });
    }

    acceptPlayer(player: Player): void {
        this.socketService.acceptRequestJoinGame(this.data.gameId, player);
    }

    rejectPlayer(player: Player): void {
        this.socketService.declineJoinGame(this.data.gameId, player);
    }

    kickPlayer(player: Player): void {
        this.socketService.kickJoinGame(this.data.gameId, player);
    }
    searchPlayer(): void{}

}

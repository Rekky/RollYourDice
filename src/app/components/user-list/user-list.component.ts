import {Component, Inject, NgZone, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Game} from '../../classes/Game';
import {Player} from '../../classes/User';
import {SocketService} from '../../services/socket.service';

@Component({
    selector: 'app-user-list',
    templateUrl: './user-list.component.html',
    styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
    players: Player[];
    playersRequest: Player[];
    loaded: boolean = false;

    constructor(
        private dialogRef: MatDialogRef<any>,
        private ngZone: NgZone,
        private socketService: SocketService,
        @Inject(MAT_DIALOG_DATA) public data: {players: Player[], playersRequest: Player[], gameId: string}
    ) { }

    ngOnInit(): void {
        this.players = this.data.players;
        this.playersRequest = this.data.playersRequest;
        setTimeout(() => {
            this.loaded = true;
        }, 1000);
    }

    closeDialog(): void {
        this.ngZone.run(() => {
            this.dialogRef.close();
        });
    }

    acceptPlayer(playerId: string): void {
        this.socketService.acceptRequestJoinGame(playerId, this.data.gameId);
    }

    rejectPlayer(playerId: string): void {
        this.socketService.acceptRequestJoinGame(playerId, this.data.gameId);
    }

    kickPlayer(playerId: string): void {
        this.socketService.acceptRequestJoinGame(playerId, this.data.gameId);
    }

}

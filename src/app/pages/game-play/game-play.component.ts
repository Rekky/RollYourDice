import { Component, OnInit } from '@angular/core';
import {GameStatus} from '../../classes/Game';
import {ActivatedRoute} from '@angular/router';
import {SocketService} from '../../services/socket.service';
import {Subscription} from 'rxjs';
import {OurKonvaMap} from '../../classes/ourKonva/OurKonvaMap';

@Component({
    selector: 'app-game-play',
    templateUrl: './game-play.component.html',
    styleUrls: ['./game-play.component.scss']
})
export class GamePlayComponent implements OnInit {

    loading: boolean = false;
    map: OurKonvaMap;
    gamePlay: {status: GameStatus, map: OurKonvaMap};

    constructor(private socketService: SocketService, private router: ActivatedRoute) { }

    ngOnInit(): void {
        this.loading = true;
        const gameId = this.router.snapshot.paramMap.get('id');
        this.socketService.sendGamePlayId(gameId);

        this.socketService.socket.on('game-play-load', (data) => {
            console.log('RECIBO_GAMEPLAY', data);
            this.gamePlay = data;
            this.loading = false;
        });
    }

}

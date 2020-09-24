import { Injectable } from '@angular/core';
import io from 'socket.io-client';
import {ApiService} from './api.service';
import {BehaviorSubject} from 'rxjs';
import {Game} from '../classes/Game';
import {SocketObject} from '../classes/sockets/SocketObject';

@Injectable({
    providedIn: 'root'
})
export class SocketService {

    private socket = io(this.apiService.API_SOCKET);
    gameSocketSubscription: BehaviorSubject<Game> = new BehaviorSubject<Game>(null);
    gameObjectSocketSubscription: BehaviorSubject<SocketObject> = new BehaviorSubject<SocketObject>(null);


    constructor(private apiService: ApiService) {
        this.socket.on('connect', () => {
            console.log('conectado al socket correctamente');
        });
        this.socket.on('disconnect', () => {
            console.log('socket desconectado!');
        });
        this.getGameEditor();
    }

    getGameEditor(): void {
        this.socket.on('game-editor', (data) => {
            this.gameSocketSubscription.next(data);
        });
        this.socket.on('game-object-editor', (data) => {
            this.gameObjectSocketSubscription.next(data);
        });
    }
}

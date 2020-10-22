import { Injectable } from '@angular/core';
import io from 'socket.io-client';
import {ApiService} from './api.service';
import {BehaviorSubject} from 'rxjs';
import {Game} from '../classes/Game';
import {SocketObject} from '../classes/sockets/SocketObject';
import {Page} from '../classes/Page';

@Injectable({
    providedIn: 'root'
})
export class SocketService {

    socket = io(this.apiService.API_SOCKET);
    gameSocketSubscription: BehaviorSubject<Game> = new BehaviorSubject<Game>(null);
    gameSocketObjectSubscription: BehaviorSubject<SocketObject> = new BehaviorSubject<SocketObject>(null);


    constructor(private apiService: ApiService) {
        this.socket.on('connect', () => {
            console.log('socket conectado');
        });
        this.socket.on('disconnect', () => {
            console.log('socket desconectado!');
        });
        this.socket.on('game-editor-load', (data) => {
            this.gameSocketSubscription.next(data);
        });
        this.socket.on('game-editor-page-update', (data) => {
            console.log('recibo PAGE', data);
            this.gameSocketSubscription.next(data);
        });
        this.socket.on('game-editor-pages-update', (data) => {
            console.log('recibo del backend pages', data);
            this.gameSocketSubscription.next(data);
        });
        this.socket.on('game-editor', (data) => {
            this.gameSocketSubscription.next(data);
        });
        this.socket.on('game-editor-object', (data) => {
            console.log('recibo del back game-editor-object', data);
            this.gameSocketObjectSubscription.next(data);
        });
    }

    sendGameEditorId(gameId: string): void {
        this.socket.emit('game-editor-load', gameId);
    }

    sendGamePageUpdate(gameId: string, page: Page): void {
        this.socket.emit('game-editor-page-update', {gameId, page});
    }

    sendGamePagesUpdate(gameId: string, pages: Page[]): void {
        this.socket.emit('game-editor-pages-update', {gameId, pages});
    }

    sendSocketObject(object: any): void {
        console.log('sendSocketObject', object);
        this.socket.emit('game-editor-object', object);
    }
}

import { Injectable } from '@angular/core';
import io from 'socket.io-client';
import {ApiService} from './api.service';
import {BehaviorSubject} from 'rxjs';
import {Game} from '../classes/Game';
import {SocketObject} from '../classes/sockets/SocketObject';
import {Page} from '../classes/Page';
import {OurKonvaMap} from '../classes/ourKonva/OurKonvaMap';
import {stringify} from '@angular/compiler/src/util';
import {OurKonvaGrid} from '../classes/ourKonva/OurKonvaGrid';

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
            console.log('RECIBO_GAME_EDITOR_LOAD', data);
        });

        // ====================== START PAGES ==================================
        this.socket.on('game-editor-create-page', (data: Page) => {
            console.log('RECIBO_NUEVA_PAGE', data);
            const game: Game = this.gameSocketSubscription.getValue();
            const gamePage: Page = game.pages.find((page: Page) => page.id === null);
            gamePage.id = data.id;
        });
        this.socket.on('game-editor-rename-page', (data: Page) => {
            // Nothing else
        });
        this.socket.on('game-editor-remove-page', (data: Page) => {
            // Nothing else
        });
        this.socket.on('game-editor-pages-update', (data) => {
            // Nothing else
        });
        this.socket.on('game-editor-page-update', (data) => {
            this.gameSocketSubscription.next(data);
        });
        // ========================= END PAGES =================================

        this.socket.on('game-editor-maps-update', (data) => {
            this.gameSocketSubscription.next(data);
        });
        this.socket.on('game-editor-object', (data) => {
            this.gameSocketObjectSubscription.next(data);
        });
    }

    sendGameEditorId(gameId: string): void {
        this.socket.emit('game-editor-load', gameId);
    }

    sendGamePageUpdate(gameId: string, page: Page): void {
        this.socket.emit('game-editor-page-update', {gameId, page});
    }

    sendGameCreatePage(gameId: string, page: Page): void {
        this.socket.emit('game-editor-create-page', {gameId, page});
    }

    sendGameRenamePage(gameId: string, page: Page): void {
        this.socket.emit('game-editor-rename-page', {gameId, page});
    }

    sendGameRemovePage(gameId: string, page: Page): void {
        this.socket.emit('game-editor-remove-page', {gameId, page});
    }

    sendGamePagesUpdate(gameId: string, pages: Page[]): void {
        this.socket.emit('game-editor-pages-update', {gameId, pages});
    }

    sendGameMapsUpdate(gameId: string, pageId: string, maps: OurKonvaMap[]): void {
        this.socket.emit('game-editor-maps-update', {gameId, pageId, maps: maps});
    }

    sendSocketObject(object: any): void {
        this.socket.emit('game-editor-object', object);
    }
}

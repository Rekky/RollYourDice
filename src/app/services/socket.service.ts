import { Injectable } from '@angular/core';
import io from 'socket.io-client';
import {ApiService} from './api.service';
import {BehaviorSubject} from 'rxjs';
import {Game, GameStatus} from '../classes/Game';
import {SocketObject} from '../classes/sockets/SocketObject';
import {Page} from '../classes/Page';
import {OurKonvaMap} from '../classes/ourKonva/OurKonvaMap';
import {UserInteractor} from '../interactors/UserInteractor';

@Injectable({
    providedIn: 'root'
})
export class SocketService {

    socket = io(this.apiService.API_SOCKET);
    gameSocketSubscription: BehaviorSubject<Game> = new BehaviorSubject<Game>(null);
    gameSocketObjectSubscription: BehaviorSubject<SocketObject> = new BehaviorSubject<SocketObject>(null);


    constructor(private apiService: ApiService, private userInteractor: UserInteractor) {
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
        this.socket.on('game-editor-update-pages', (data) => {
            // Nothing else
        });
        // ========================= END PAGES =================================

        // ========================= START MAPS ================================
        this.socket.on('game-editor-create-map', (data: OurKonvaMap) => {
            const game: Game = this.gameSocketSubscription.getValue();
            const gamePage: Page = game.pages.find((page: Page) => page.id === game.selectedPageId);
            const gameMap: OurKonvaMap = gamePage.maps.find((map: OurKonvaMap) => parseInt(map.id, 0) <= 0);
            gameMap.id = data.id;
        });
        this.socket.on('game-editor-rename-map', (data: OurKonvaMap) => {
            // Nothing else
        });
        this.socket.on('game-editor-remove-map', (data: OurKonvaMap) => {
            // Nothing else
        });
        this.socket.on('game-editor-update-maps', (data: OurKonvaMap[]) => {
            // Nothing else
        });
        this.socket.on('game-editor-move-map', (data: OurKonvaMap) => {
            // this.gameSocketSubscription.next(data);
        });
        this.socket.on('game-editor-object', (data) => {
            // this.gameSocketObjectSubscription.next(data);
        });
        this.socket.on('game-editor-set-players-map', (data) => {
            // Nothing
        });
        // ======================== END MAPS ===================================

        // ======================== START GAME PLAY ============================
        // this.socket.on('game-play-load', (data) => {
        //     console.log('RECIBO_GAME_PLAY', data);
        // });
        this.socket.on('game-start-status', (data) => {
            console.log('RECIBO_GAME_PLAY', data);
        });

        // ======================== END GAME PLAY ==============================
    }

    sendGameEditorId(gameId: string): void {
        this.socket.emit('game-editor-load', gameId);
    }

    sendGamePlayId(gameId: string): void {
        const userId = this.userInteractor.getCurrentUser().id;
        this.socket.emit('game-play-load', {gameId, userId});
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

    sendGameCreateMap(pageId: string, map: OurKonvaMap): void {
        console.log(map);
        this.socket.emit('game-editor-create-map', {pageId, map});
    }

    sendGameRemoveMap(pageId: string, map: OurKonvaMap): void {
        this.socket.emit('game-editor-remove-map', {pageId, map});
    }

    sendGameRenameMap(pageId: string, map: OurKonvaMap): void {
        this.socket.emit('game-editor-rename-map', {pageId, map});
    }

    sendGameMoveMap(map: OurKonvaMap): void {
        this.socket.emit('game-editor-move-map', {map});
    }

    sendGameMapsUpdate(gameId: string, pageId: string, maps: OurKonvaMap[]): void {
        this.socket.emit('game-editor-maps-update', {gameId, pageId, maps});
    }

    sendSocketObject(object: any): void {
        this.socket.emit('game-editor-object', object);
    }

    sendGameSetToPlayersMap(gameId: string, pageId: string, map: OurKonvaMap): void {
        this.socket.emit('game-editor-set-players-map', {gameId, pageId, map});
    }

    sendGameStartStatus(gameId: string, gameStatus: GameStatus): void {
        const userId = this.userInteractor.getCurrentUser().id;
        this.socket.emit('game-play-start-status', {gameId, userId, gameStatus});
    }
}

import { Injectable } from '@angular/core';
import io from 'socket.io-client';
import {ApiService} from './api.service';
import {BehaviorSubject} from 'rxjs';
import {Game, GameStatus} from '../classes/Game';
import {SocketObject} from '../classes/sockets/SocketObject';
import {OurKonvaMap} from '../classes/ourKonva/OurKonvaMap';
import {UserInteractor} from '../interactors/UserInteractor';
import {environment} from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class SocketService {

    socket = io(environment.socket_url);
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

        // ========================= START MAPS ================================
        this.socket.on('game-editor-create-map', (data: OurKonvaMap) => {
            const game: Game = this.gameSocketSubscription.getValue();
            // const gameMap: OurKonvaMap = game.mapsId.find((map: OurKonvaMap) => parseInt(map.id, 0) <= 0);
            // gameMap.id = data.id;
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
        // ======================== MAP OBJECTS ================================

        this.socket.on('game-editor-create-map-object', (data: any) => {
            console.log('RECIBOD OBJECT', data);
        });
        // ======================== END OBJECTS ================================
    }

    sendGameEditorId(gameId: string): void {
        this.socket.emit('game-editor-load', gameId);
    }

    sendGamePlayId(gameId: string): void {
        const userId = this.userInteractor.getCurrentUser().id;
        this.socket.emit('game-play-load', {gameId, userId});
    }


    sendGameCreateMap(gameId: string, map: OurKonvaMap): void {
        this.socket.emit('game-editor-create-map', {gameId, map});
    }

    sendGameRemoveMap(gameId: string, map: OurKonvaMap): void {
        this.socket.emit('game-editor-remove-map', {gameId, map});
    }

    sendGameRenameMap(gameId: string, map: OurKonvaMap): void {
        this.socket.emit('game-editor-rename-map', {gameId, map});
    }

    sendGameMoveMap(map: OurKonvaMap): void {
        this.socket.emit('game-editor-move-map', {map});
    }

    sendGameMapsUpdate(gameId: string, maps: OurKonvaMap[]): void {
        this.socket.emit('game-editor-maps-update', {gameId, maps});
    }

    sendGameCreateMapObject(mapId: string, object: any): void {
        this.socket.emit('game-editor-create-map-object', {mapId, object});
    }

    sendGameEditMapObject(object: any): void {
        this.socket.emit('game-editor-edit-map-object', {object});
    }

    sendGameSetToPlayersMap(gameId: string, map: OurKonvaMap): void {
        this.socket.emit('game-editor-set-players-map', {gameId, map});
    }

    sendGameStartStatus(gameId: string, status: GameStatus): void {
        const userId = this.userInteractor.getCurrentUser().id;
        this.socket.emit('game-play-start-status', {gameId, userId, status});
    }
}

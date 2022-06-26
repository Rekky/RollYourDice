import { Injectable } from '@angular/core';
import io from 'socket.io-client';
import {ApiService} from './api.service';
import {BehaviorSubject} from 'rxjs';
import {Game, GameStatus} from '../classes/Game';
import {SocketObject} from '../classes/sockets/SocketObject';
import {OurKonvaMap, OurKonvaMapModification} from '../classes/ourKonva/OurKonvaMap';
import {UserInteractor} from '../interactors/UserInteractor';
import {environment} from '../../environments/environment';
import {MapInteractor} from '../interactors/MapInteractor';
import {GameInteractor} from '../interactors/GameInteractor';
import {NotificationsService} from './notifications.service';
import {MyAdventuresInteractor} from '../pages/launcher/my-adventures/my-adventures-interactor';
import { Player } from '../classes/User';

@Injectable({
    providedIn: 'root'
})
export class SocketService {

    socket = io.connect(environment.socket_url, {query: {token: this.userInteractor.getCurrentToken()}});
    gameSocketSubscription: BehaviorSubject<Game> = new BehaviorSubject<Game>(null);
    gameSocketObjectSubscription: BehaviorSubject<SocketObject> = new BehaviorSubject<SocketObject>(null);


    constructor(private apiService: ApiService,
                private userInteractor: UserInteractor,
                private mapInteractor: MapInteractor,
                private notificationService: NotificationsService,
                private gameInteractor: GameInteractor,
                private myAdventuresInteractor: MyAdventuresInteractor) {

        this.socket.on('connect', () => {
            console.log('socket conectado');

            const token = this.userInteractor.getCurrentToken();
            this.socket.emit('add-player-online', {token});
        });
        this.socket.on('disconnect', () => {
            console.log('socket desconectado!');
        });
        this.socket.on('game-editor-load', (data) => {
            this.gameSocketSubscription.next(data);
            console.log('RECIBO_GAME_EDITOR_LOAD', data);
        });

        // =========================== META =====================================
        this.socket.on('meta-selected-map', (data) => {
            this.userInteractor.userSubject.value.meta = data.meta;
            console.log('RECEIVE_META', data);
        });
        this.socket.on('meta-map', (data) => {
            this.userInteractor.userSubject.value.meta = data.meta;
            console.log('RECEIVE_MAP_META', data);
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

        // ======================== START GAME PLAY ============================
        this.socket.on('game-status', (data) => {
            console.log('game-status', data);
            this.myAdventuresInteractor.updateGameStatus(data);
        });

        // ======================== MAP OBJECTS ================================
        this.socket.on('game-editor-create-map-object', (data: any) => {
            const mod = OurKonvaMapModification.generateModification('create', data);
            this.mapInteractor.setCurrentMapMod(mod);
        });

        this.socket.on('game-editor-update-map-object', (data: any) => {
            const mod = OurKonvaMapModification.generateModification('update', data);
            this.mapInteractor.setCurrentMapMod(mod);
        });

        this.socket.on('game-editor-delete-map-object', (data: any) => {
            const mod = OurKonvaMapModification.generateModification('delete', data);
            this.mapInteractor.setCurrentMapMod(mod);
        });

        // ======================== MAP CAMERAS ================================
        this.socket.on('game-editor-create-map-camera', (data: any) => {

        });
        this.socket.on('game-editor-delete-map-camera', (data: any) => {

        });

        // ======================== SOCIAL =====================================
        this.socket.on('social-join-game-request', (data) => {
            this.myAdventuresInteractor.updateGamePlayersRequested(data);
        });

        this.socket.on('social-accept-game-request', (data) => {
            this.myAdventuresInteractor.acceptGamePlayersRequested(data);
        });

        this.socket.on('social-decline-game-request', (data) => {
            this.myAdventuresInteractor.declineGamePlayersRequested(data);
        });

        this.socket.on('social-kick-game-request', (data) => {
            this.myAdventuresInteractor.kickGamePlayers(data);
            this.gameInteractor.kickedGameId.next(data.gameId);
        });

        this.socket.on('social-cancel-game-request', (data) => {
            this.myAdventuresInteractor.cancelGamePlayers(data);
        });
    }

    ////////////////////////////// SENDERS ////////////////////////////////////
    sendGameEditorId(gameId: string): void {
        this.socket.emit('game-editor-load', gameId);
    }

    sendGamePlayId(gameId: string): void {
        const userId = this.userInteractor.getCurrentUser().id;
        this.socket.emit('game-play-load', {gameId, userId});
    }

    ////////////////////////////// META //////////////////////////////////////
    sendMetaSelectedMap(mapId: string): void {
        this.socket.emit('meta-selected-map', {mapId});
    }

    sendMetaDragMap(mapId: string, attrs: any): void {
        this.socket.emit('meta-drag-map', {mapId, attrs});
    }

    sendGameCreateMap(gameId: string, map: OurKonvaMap): void {
        this.socket.emit('game-editor-create-map', {gameId, map});
    }

    sendGameDeleteMap(gameId: string, map: OurKonvaMap): void {
        this.socket.emit('game-editor-delete-map', {gameId, map});
    }

    sendGameUpdateMap(gameId: string, map: OurKonvaMap): void {
        this.socket.emit('game-editor-update-map', {gameId, map});
    }

    sendGameUpdateMapsOrder(gameId: string, maps: OurKonvaMap[]): void {
        const mapsIds = maps.map(map => map.id);
        this.socket.emit('game-editor-update-order-maps', {gameId, mapsIds});
    }

    sendGameSetToPlayersMap(gameId: string, map: OurKonvaMap): void {
        this.socket.emit('game-editor-set-players-map', {gameId, map});
    }

    sendPlayerEnterGame(gameId: string): void {
        this.socket.emit('game-editor-player-enter', {gameId});
    }

    sendGameStatus(gameId: string, status: GameStatus): void {
        this.socket.emit('game-status', {gameId, status});
    }

    ////////////////////// OBJECTS //////////////////////////////

    createGameObject(mapId: string, object: any): void {
        console.log('Called create game object');
        this.socket.emit('game-editor-create-map-object', {mapId, object});
    }

    updateGameObject(mapId: string, object: any): void {
        console.log('Called update game object =', object);
        this.socket.emit('game-editor-update-map-object', {mapId, object});
    }

    deleteGameObject(mapId: string, object: any): void {
        this.socket.emit('game-editor-delete-map-object', {mapId, objectId: object.id});
        const mod = OurKonvaMapModification.generateModification('delete', {mapId, object});
        this.mapInteractor.setCurrentMapMod(mod);
    }

    ///////////////////////// CAMERAS //////////////////////////////////
    createCamera(mapId: string, camera: any): void {
        this.socket.emit('game-editor-create-map-camera', {mapId, camera});
    }

    updateCamera(mapId: string, camera: any): void {
        this.socket.emit('game-editor-update-map-camera', {mapId, camera});
    }

    deleteCamera(mapId: string, camera: any): void {
        this.socket.emit('game-editor-delete-map-camera', {mapId, camera});
    }

    ///////////////////////// REQUESTS //////////////////////////////////

    requestJoinGame(gameId: string, authorId: string): void {
        this.socket.emit('social-join-game-request', {gameId, authorId});
    }

    acceptRequestJoinGame(gameId: string, player: Player): void {
        const userId = player.id;
        this.socket.emit('social-accept-game-request', {gameId, userId});
        this.myAdventuresInteractor.masterAcceptGamePlayersRequested(gameId, player);
    }

    declineJoinGame(gameId: string, player: Player): void {
        const userId = player.id;
        this.socket.emit('social-decline-game-request', {gameId, userId});
        this.myAdventuresInteractor.masterDeclineGamePlayers(gameId, player);
    }

    kickJoinGame(gameId: string, player: Player): void {
        const userId = player.id;
        this.socket.emit('social-kick-game-request', {gameId, userId});
        this.myAdventuresInteractor.masterKickGamePlayers(gameId, player);
    }

    cancelJoinGameRequest(gameId: string, userId: string): void {
        this.socket.emit('social-cancel-game-request', {gameId, userId});
        this.myAdventuresInteractor.playerCancelGameRequest(gameId);
    }

}

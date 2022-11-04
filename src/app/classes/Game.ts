import {AssetModel} from './AssetModel';
import {OurKonvaMap} from './ourKonva/OurKonvaMap';
import { ulid } from 'ulid';
import {Player} from './User';

export class Game {
    id: string;
    author: Player;
    hash: string;
    createAt: Date;
    updatedAt: Date;
    description: string;
    gameType: GameTypes;
    coverImage: AssetModel;
    name: string;
    maxNPlayers: number;
    players: Player[];
    playersRequested: Player[];
    mapsId: string[];
    published: boolean;
    status: GameStatusEnum;

    constructor(authorId?: string) {
        this.id = null;
        this.name = 'My adventure rocks!';
        this.mapsId = [];
        this.published = false;
        this.gameType = GameTypes.DungeonsAndDragons5e;
        this.author = new Player(authorId ? authorId : null, '', '');
        this.createAt = new Date();
        this.updatedAt = new Date();
        this.maxNPlayers = 6;
        this.coverImage = new AssetModel();
        this.description = '';
        this.status = GameStatusEnum.STOPPED;
    }

    static fromJSON(json: any): Game {
        return {...new Game(json.authorId), ...json};
    }
}

export enum GameTypes {
    DungeonsAndDragons5e = 'DungeonsAndDragons5e',
}

export enum GameStatusEnum {
    RUNNING = 'RUNNING',
    PAUSED = 'PAUSED',
    STOPPED = 'STOPPED'
}

import {Asset} from './Asset';
import {OurKonvaMap} from './ourKonva/OurKonvaMap';

export class Game {
    id: string | null;
    authorId: string;
    createAt: Date;
    updatedAt: Date;
    description: string;
    gameType: GameTypes;
    coverImage: Asset;
    name: string;
    nPlayers: number;
    mapsId: string[];
    published: boolean;
    status: GameStatus;

    constructor(authorId: string) {
        this.id = null;
        this.name = 'My adventure rocks!';
        this.mapsId = [];
        this.published = false;
        this.gameType = GameTypes.DungeonsAndDragons5e;
        this.authorId = authorId;
        this.createAt = new Date();
        this.updatedAt = new Date();
        this.nPlayers = 6;
        this.coverImage = new Asset();
        this.description = '';
        this.status = GameStatus.Stopped;
    }

    static fromJSON(json: any): Game {
        const game = {...new Game(json.authorId), ...json};
        return game;
    }
}

export enum GameTypes {
    DungeonsAndDragons5e = 'DungeonsAndDragons5e',
}

export enum GameStatus {
    Running,
    Paused,
    Stopped
}

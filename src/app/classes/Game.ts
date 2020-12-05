import {Page} from './Page';
import {Asset} from './Asset';

export class Game {
    id: string | null;
    authorId: string;
    createdDate: Date;
    description: string;
    gameType: GameTypes;
    image: Asset;
    name: string;
    nPlayers: number;
    pages: Page[];
    published: boolean;
    selectedPageId: string | null;
    status: GameStatus;

    constructor(authorId: string) {
        this.id = null;
        this.name = 'My adventure rocks!';
        this.pages = [new Page()];
        this.selectedPageId = null;
        this.published = false;
        this.gameType = GameTypes.DungeonsAndDragons5e;
        this.authorId = authorId;
        this.createdDate = new Date();
        this.nPlayers = 6;
        this.image = new Asset();
        this.description = '';
        this.status = GameStatus.Stopped;
    }

    static fromJSON(json: any): Game {
        // const game = new Game(json.authorId);
        // Object.keys(game).forEach((key) => {
        //     game[key] = json[key] ? json[key] : game[key];
        // });
        // game.pages = (json.pages && json.pages.length > 0) ? json.pages.map(el => Page.fromJSON(el)) : [];
        // game.image = json.image ? Asset.fromJSON(json.image) : new Asset();
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

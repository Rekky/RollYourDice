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
        const game = new Game(json.authorId);
        Object.keys(game).forEach((key) => {
            game[key] = json[key] ? json[key] : game[key];
        });
        game.pages = json.pages ? json.pages.map(el => Page.fromJSON(el)) : [];
        return game;
    }

    toJSON(): any {
        const json: any = {};
        Object.keys(Game).forEach((key) => {
            json[key] = this[key];
        });
        json.pages = this.pages.map(page => page.toJSON());
        return json;
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

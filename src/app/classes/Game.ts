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
    }

    static fromJSON(json: any): Game {
        const game = new Game(json.authorId);
        game.id = json.id;
        game.name = json.name;
        game.pages = json.pages ? json.pages.map(el => Page.fromJSON(el)) : [];
        game.selectedPageId = json.selectedPageId;
        game.published = json.published;
        game.gameType = json.gameType;
        game.createdDate = json.createdDate;
        game.image = json.image;
        game.nPlayers = json.nPlayers;
        game.description = json.description;
        return game;
    }

    toJSON(): any {
        const json: any = {};
        json.id = this.id;
        json.name = this.name;
        json.pages = this.pages.map(page => page.toJSON());
        json.selectedPageId = this.selectedPageId;
        json.published = this.published;
        json.gameType = this.gameType;
        json.authorId = this.authorId;
        json.createdDate = this.createdDate;
        json.image = this.image;
        json.nPlayers = this.nPlayers;
        json.description = this.description;
        return json;
    }
}

export enum GameTypes {
    DungeonsAndDragons5e = 'DungeonsAndDragons5e',
}

import {Page} from './Page';
export enum GameTypes {
    DungeonsAndDragons5e = 'DungeonsAndDragons5e',
}
export class Game {
    id: string | null;
    name: string;
    pages: Page[];
    selectedPageId: string | null;
    privacy: 'private' | 'public'; // public | private
    gameType: GameTypes;
    author: string | number;
    gameStatus: boolean;
    createdDate: Date;

    constructor(id?: string,
                name?: string,
                pages?: Page[],
                selectedPageId?: string | null,
                privacy?: 'private' | 'public',
                gameType?: GameTypes,
                author?: string | number,
                gameStatus?: boolean,
                createdDate?: Date
    ) {
        this.id = id ? id : null;
        this.name = name ? name : 'new Game';
        this.pages = pages ? pages : [new Page()];
        this.selectedPageId = selectedPageId ? selectedPageId : null;
        this.privacy = privacy ? privacy : 'private';
        this.gameType = gameType ? gameType : GameTypes.DungeonsAndDragons5e;
        this.author = author ? author : null;
        this.gameStatus = gameStatus ? gameStatus : false;
        this.createdDate = createdDate ? createdDate : new Date();
    }

    static fromJSON(json: any): Game {
        const game = new Game();
        game.id = json.id;
        game.name = json.name;
        game.pages = json.pages.map(el => Page.fromJSON(el));
        game.selectedPageId = json.selectedPageId;
        game.privacy = json.privacy;
        game.gameType = json.gameType;
        game.author = json.author;
        game.gameStatus = json.gameStatus;
        game.createdDate = json.createdDate;
        return game;
    }

    toJSON(): any {
        const json: any = {};
        json.id = this.id;
        json.name = this.name;
        json.pages = this.pages.map(page => page.toJSON());
        json.selectedPageId = this.selectedPageId;
        json.privacy = this.privacy;
        json.gameType = this.gameType;
        json.author = this.author;
        json.gameStatus = this.gameStatus;
        json.createdDate = this.createdDate;
        return json;
    }
}

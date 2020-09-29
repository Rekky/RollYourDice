import {Page} from './Page';

export class Game {
    id: string | number;
    name: string;
    pages: Page[];
    selectedPageId: string | null;
    privacy: 'private' | 'public'; // public | private
    gameType: 'dungeonsAndDragons5e';
    createdDate: Date;

    constructor(id?: number,
                name?: string,
                pages?: Page[],
                selectedPageId?: string | null,
                privacy?: 'private' | 'public',
                gameType?: 'dungeonsAndDragons5e',
                createdDate?: Date
    ) {
        this.id = id ? id : '-' + Math.floor(Math.random() * 1000);
        this.name = name ? name : 'new Game';
        this.pages = pages ? pages : [];
        this.selectedPageId = selectedPageId ? selectedPageId : null;
        this.privacy = privacy ? privacy : 'private';
        this.gameType = gameType ? gameType : 'dungeonsAndDragons5e';
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
        json.createdDate = this.createdDate;
        return json;
    }
}

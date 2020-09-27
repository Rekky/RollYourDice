import {Page} from './Page';

export class Game {
    id: string | number;
    name: string;
    pages: Page[];
    selectedPageId: string | null;

    constructor(id?: number, name?: string, pages?: Page[], selectedPageId?: string | null) {
        this.id = id ? id : '-' + Math.floor(Math.random() * 1000);
        this.name = name ? name : 'new Game';
        this.pages = pages ? pages : [];
        this.selectedPageId = selectedPageId ? selectedPageId : null;
    }

    static fromJSON(json: any): Game {
        const game = new Game();
        game.id = json.id;
        game.name = json.name;
        game.pages = json.pages.map(el => Page.fromJSON(el));
        game.selectedPageId = json.selectedPageId;
        return game;
    }

    toJSON(): any {
        const json: any = {};
        json.id = this.id;
        json.name = this.name;
        json.pages = this.pages.map(page => page.toJSON());
        json.selectedPageId = this.selectedPageId;
        return json;
    }
}

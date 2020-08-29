import {Page} from './Page';

export class Game {
    id: string | number;
    pages: Page[] | null;
    selectedPageId: string | null;

    constructor(id?: number, pages?: Page[], selectedPageId?: string | null) {
        this.id = id ? id : -1;
        this.pages = pages ? pages : null;
        this.selectedPageId = selectedPageId ? selectedPageId : null;
    }

    static fromJSON(json: any): Game {
        const game = new Game();
        game.id = json.id;
        game.pages = json.pages.map(el => Page.fromJSON(el));
        game.selectedPageId = json.selectedPageId;
        return game;
    }

    toJSON(): any {
        const json: any = {};
        json.id = this.id;
        json.pages = this.pages.map(page => page.toJSON());
        json.selectedPageId = this.selectedPageId;
        return json;
    }
}

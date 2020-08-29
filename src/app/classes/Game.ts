import {Page} from './Page';

export class Game {
    id: string | number;
    pages: Page[] | null;

    constructor(id?: number, pages?: Page[]) {
        this.id = id ? id : -1;
        this.pages = pages ? pages : null;
    }

    static fromJSON(json: any): Game {
        const game = new Game();
        game.id = json.id;
        game.pages = json.pages.map(el => Page.fromJSON(el));
        return game;
    }

    toJSON(): any {
        const json: any = {};
        json.id = this.id;
        json.pages = this.pages.map(page => page.toJSON());
        return json;
    }
}

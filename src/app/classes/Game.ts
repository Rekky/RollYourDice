import {Page} from './Page';
import {CustomImage} from './CustomImage';

export class Game {
    id: string | null;
    name: string;
    description: string;
    image: CustomImage;
    nPlayers: number;
    pages: Page[];
    selectedPageId: string | null;
    published: boolean;
    gameType: GameTypes;
    authorId: string;
    createdDate: Date;

    constructor(authorId: string,
                id?: string,
                name?: string,
                description?: string,
                pages?: Page[],
                image?: CustomImage,
                nPlayers?: number,
                selectedPageId?: string | null,
                published?: boolean,
                gameType?: GameTypes,
                createdDate?: Date
    ) {
        this.id = id ? id : null;
        this.name = name ? name : 'My adventure rocks!';
        this.pages = pages ? pages : [new Page()];
        this.selectedPageId = selectedPageId ? selectedPageId : null;
        this.published = published ? published : false;
        this.gameType = gameType ? gameType : GameTypes.DungeonsAndDragons5e;
        this.authorId = authorId;
        this.createdDate = createdDate ? createdDate : new Date();
        this.nPlayers = nPlayers ? nPlayers : 6;
        this.image = image ? image : new CustomImage();
        this.description = description ? description : '';
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
    Test = 'test'
}

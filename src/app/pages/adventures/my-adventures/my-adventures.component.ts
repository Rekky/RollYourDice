import {Component, OnDestroy, OnInit} from '@angular/core';
import {Game, GameTypes} from '../../../classes/Game';
import {GameInteractor} from '../../../interactors/GameInteractor';
import {User} from '../../../classes/User';
import {UserInteractor} from '../../../interactors/UserInteractor';
import {Subscription} from 'rxjs';
import {Page} from '../../../classes/Page';
import {Asset} from '../../../classes/Asset';

@Component({
    selector: 'app-my-adventures',
    templateUrl: './my-adventures.component.html',
    styleUrls: ['./my-adventures.component.scss']
})
export class MyAdventuresComponent implements OnInit, OnDestroy {

    adventures: Game[];
    games: Game[] = [
        Game.fromJSON({
            name: 'the lost monkey',
            description: 'When the universe was young the sky was filled with planets, and stars, and stardust, and many many rocks.',
            image: new Asset(),
            nPlayers: 6,
            published: false,
            gameType: GameTypes.DungeonsAndDragons5e,
            createdDate: new Date(),
            id: '888888',
            authorId: '9898554',
            pages: [new Page()],
            selectedPageId: 'aaaaa'
        }),
        Game.fromJSON({
            name: 'The Ring',
            description: 'Under the mountain it rest, guarded by a monster lost in the darkness.',
            image: new Asset(),
            nPlayers: 4,
            published: true,
            gameType: GameTypes.DungeonsAndDragons5e,
            createdDate: new Date(),
            id: '7444444',
            authorId: '65482146',
            pages: [new Page()],
            selectedPageId: 'aaaaa'
        }),
        Game.fromJSON({
            name: 'Lorem ipsum',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque egestas mattis tempor. Nulla vel suscipit elit, et elementum leo. Nulla orci urna, vehicula sed dui sed, fermentum blandit felis. Donec viverra libero et nisi consectetur, a sagittis mauris tincidunt. In hac habitasse platea dictumst. Sed mollis metus nec libero lobortis, sed congue leo scelerisque. Nunc facilisis lorem id velit suscipit lacinia. In hac habitasse platea dictumst. Morbi eget pharetra lorem.',
            image: new Asset(),
            nPlayers: 10,
            published: true,
            gameType: GameTypes.DungeonsAndDragons5e,
            createdDate: new Date(),
            id: '7444444',
            authorId: '65482146',
            pages: [new Page()]
        })
    ];

    displayOptions: boolean = false;
    displayedGameIndex: number = 0;
    adventuresImages: string[] = [];
    currentUser: User;
    gameToEdit: Game | null = null;

    userSubscription: Subscription;

    constructor(private gameInteractor: GameInteractor,
                private userInteractor: UserInteractor) {
        this.currentUser = this.userInteractor.getCurrentUser();
        this.games[0].image.uri = 'https://preview.redd.it/ufxpjuc55xv01.png?width=960&crop=smart&auto=webp&s=abc9c4b569ebb1feab080170164919c2c82c3aeb';
        this.games[0].image.name = 'aaaaaa';
        this.games[1].image.uri = 'https://preview.redd.it/y4zh9zp7vx031.jpg?width=960&crop=smart&auto=webp&s=ce4a11fdd3e6d06e26a9157516a911d7070137df';
        this.games[1].image.name = 'bbbbbb';
        this.games[2].image.uri = 'https://64.media.tumblr.com/4f00a47b24745b1860ca9631301a9036/0457ac9ff4d85be1-a1/s1280x1920/d1dd1c1664f7cab3a7b0a2194d5d558f06dd1b61.jpg';
        this.games[2].image.name = 'cccccc';
    }

    // async ngOnInit(): Promise<void> {
    //     try {
    //         this.adventures = await this.gameInteractor.getMyGames(this.currentUser.id);
    //     } catch (e) {
    //         console.log(e);
    //     }
    // }

    ngOnInit(): void {
        this.games.forEach(game => {
            game.authorId = this.currentUser.id;
        });
        this.updateCarrouselImages();
    }

    ngOnDestroy(): void {
        if (this.userSubscription) {
            this.userSubscription.unsubscribe();
        }
    }

    // TODO Fix adventures
    updateCarrouselImages(): void {
        this.adventures = this.games.map((game: any) => {
            return Game.fromJSON(game);
        });
        if (this.adventures.length > 0) {
            this.adventuresImages = this.adventures.map(adventure => {
                return adventure.image.uri;
            });
        } else {
            this.displayedGameIndex = 999999;
        }
    }

    createNewGame(): void {
        this.gameToEdit = new Game(this.currentUser.id);
    }

    editGame(): void {
        this.displayOptions = false;
        this.gameToEdit = this.games[this.displayedGameIndex];
    }

    deleteGame(): void {
        this.displayOptions = false;
        // TODO send games to backend, if OK continue
        this.games.splice(this.displayedGameIndex, 1);
        this.updateCarrouselImages();
    }

    saveGame(game: Game): void {
        // TODO add response as game
        if (this.displayedGameIndex === 999999) {
            this.games.push(game);
            this.displayedGameIndex = this.games.length - 1;
        } else {
            this.games[this.displayedGameIndex] = game;
        }
        this.gameToEdit = null;
        this.updateCarrouselImages();
    }

    closeEditGame(): void {
        this.gameToEdit = null;
    }

    loadGame(): void {
        this.gameInteractor.goToTheGame(this.games[this.displayedGameIndex]);
    }

}

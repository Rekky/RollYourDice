import {Game, GameStatus, GameTypes} from '../../app/classes/Game';
import {Asset} from '../../app/classes/Asset';
import {Page} from '../../app/classes/Page';

export const myGames: Game[] = [
    {
        id: '134TGHiaskAID12',
        authorId: '1231sDASD123dASd',
        createdDate: new Date(),
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus consectetur enim neque, quis consequat lacus faucibus sit amet. Integer sit amet maximus diam. Aenean dapibus luctus quam.',
        gameType: GameTypes.DungeonsAndDragons5e,
        image: {
            name: '',
            uri: '/assets/backgrounds/dragons-lair.jpg',
            extension: '',
            id: '',
            data: null
        },
        name: 'This is my game',
        nPlayers: 6,
        pages: [new Page()],
        published: false,
        selectedPageId: '12nasdADe1AXd12d',
        status: GameStatus.Stopped
    },
    {
        id: '134TGH868ID12',
        authorId: '123158SD123dASd',
        createdDate: new Date(),
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer sit amet maximus diam. Aenean dapibus luctus quam.',
        gameType: GameTypes.DungeonsAndDragons5e,
        image: {
            name: '',
            uri: '/assets/backgrounds/dwarven-forge.jpg',
            extension: '',
            id: '',
            data: null
        },
        name: 'Troll island',
        nPlayers: 4,
        pages: [new Page()],
        published: false,
        selectedPageId: '12nasdADe1542AXd12d',
        status: GameStatus.Stopped
    },
    {
        id: '134TGH855768ID12',
        authorId: '123158SD45123dASd',
        createdDate: new Date(),
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus consectetur enim neque, quis consequat lacus faucibus sit amet. Integer sit amet maximus diam. Aenean dapibus luctus quam.',
        gameType: GameTypes.DungeonsAndDragons5e,
        image: {
            name: '',
            uri: '/assets/backgrounds/enchanted-garden.jpg',
            extension: '',
            id: '',
            data: null
        },
        name: 'Goblinator',
        nPlayers: 5,
        pages: [new Page()],
        published: false,
        selectedPageId: '12nasdA45UDe1542AXd12d',
        status: GameStatus.Stopped
    },
    {
        id: '134TGH85785768ID12',
        authorId: '12315854SD45123dASd',
        createdDate: new Date(),
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus consectetur enim neque, quis consequat lacus faucibus sit amet. Integer sit amet maximus diam. Aenean dapibus luctus quam.',
        gameType: GameTypes.DungeonsAndDragons5e,
        image: {
            name: '',
            uri: '/assets/backgrounds/entrance-to-the-mine.jpg',
            extension: '',
            id: '',
            data: null
        },
        name: 'Bang Bang town',
        nPlayers: 7,
        pages: [new Page()],
        published: false,
        selectedPageId: '12nasdAUY45UDe1542AXd12d',
        status: GameStatus.Stopped
    },
    {
        id: '134TGH83335785768ID12',
        authorId: '1123dASd',
        createdDate: new Date(),
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus consectetur enim neque, quis consequat lacus faucibus sit amet. Integer sit amet maximus diam. Aenean dapibus luctus quam.',
        gameType: GameTypes.DungeonsAndDragons5e,
        image: {
            name: '',
            uri: '/assets/backgrounds/evil-altar.jpg',
            extension: '',
            id: '',
            data: null
        },
        name: 'Never stop us',
        nPlayers: 6,
        pages: [new Page()],
        published: false,
        selectedPageId: '12nas35UDe1542AXd12d',
        status: GameStatus.Stopped
    }
];

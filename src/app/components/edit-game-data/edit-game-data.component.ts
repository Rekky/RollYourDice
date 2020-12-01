import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { Game, GameTypes } from 'src/app/classes/Game';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Asset} from '../../classes/Asset';
import {Page} from '../../classes/Page';

@Component({
    selector: 'app-edit-game-data',
    templateUrl: './edit-game-data.component.html',
    styleUrls: ['./edit-game-data.component.scss']
})
export class EditGameDataComponent implements OnInit {

    @Input() game: Game;
    @Output() saveGame: EventEmitter<Game> = new EventEmitter<Game>();
    @Output() closeGame: EventEmitter<void> = new EventEmitter<void>();

    gameForm: FormGroup;
    newGame: Game;
    gameTypes: string[] = [];
    loaded: boolean = false;

    constructor() { }

    ngOnInit(): void {
        console.log('first game =', this.game);
        this.newGame = Game.fromJSON(this.game);
        this.gameForm = new FormGroup({
            name: new FormControl(this.newGame.name, Validators.required),
            description: new FormControl(this.newGame.description),
            nPlayers: new FormControl(this.newGame.nPlayers, Validators.required),
            gameType: new FormControl(this.newGame.gameType, Validators.required),
            imageCover: new FormControl(null),
            publish: new FormControl(this.newGame.published, Validators.required),
        });
        this.gameTypes = Object.values(GameTypes);
        setTimeout(() => {
            this.loaded = true;
        }, 1000);
    }

    closeEdit(): void {
        this.closeGame.emit();
    }

    acceptChanges(): void {
        Object.keys(this.gameForm.value).forEach((key) => {
            this.newGame[key] = this.gameForm.value[key] ? this.gameForm.value[key] : this.newGame[key];
        });
        this.saveGame.emit(this.newGame);
    }

    imageChanged(file: File): void {
        const image = new Asset();
        image.name = file.name;
        this.transformFileToBase64(file).then(res => image.data = res);
        this.newGame.image = image;
    }

    transformFileToBase64(file: File): Promise<string | ArrayBuffer | null> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }
}

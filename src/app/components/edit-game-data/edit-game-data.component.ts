import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { Game, GameTypes } from 'src/app/classes/Game';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {CustomImage} from '../../classes/CustomImage';

@Component({
    selector: 'app-edit-game-data',
    templateUrl: './edit-game-data.component.html',
    styleUrls: ['./edit-game-data.component.scss']
})
export class EditGameDataComponent implements OnInit {

    @Input() game: Game;
    @Output() closeGame: EventEmitter<void> = new EventEmitter<void>();

    gameForm: FormGroup;
    gameTypes: string[] = [];
    loaded: boolean = false;

    constructor() { }

    ngOnInit(): void {
        this.gameForm = new FormGroup({
            name: new FormControl(this.game.name, Validators.required),
            description: new FormControl(this.game.description),
            nPlayers: new FormControl(this.game.nPlayers, Validators.required),
            gameType: new FormControl(this.game.gameType, Validators.required),
            imageCover: new FormControl(null, Validators.required),
            publish: new FormControl(this.game.published, Validators.required),
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
        console.log('aa = ', this.gameForm.get('imageCover').value);
        this.game.gameType = this.gameForm.get('gameType').value;
        this.game = Game.fromJSON(this.gameForm.value);
        console.log('wut =', this.game);
    }

    imageChanged(ev: any): void {
        console.log('image =', ev.files[0]);
        this.game.image = new CustomImage(ev.files[0].name, 'src');
    }

}

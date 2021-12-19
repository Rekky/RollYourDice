import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { Game, GameTypes } from 'src/app/classes/Game';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
    selector: 'app-edit-game-data',
    templateUrl: './edit-game-data.component.html',
    styleUrls: ['./edit-game-data.component.scss']
})
export class EditGameDataComponent implements OnInit {

    @Input() game: Game;
    @Output() saveGame: EventEmitter<any> = new EventEmitter<any>();
    @Output() closeGame: EventEmitter<void> = new EventEmitter<void>();

    gameForm: FormGroup;
    newGame: Game;
    gameTypes: string[] = [];
    loaded: boolean = false;

    constructor() { }

    ngOnInit(): void {
        this.newGame = Game.fromJSON(this.game);
        this.gameForm = new FormGroup({
            name: new FormControl(this.newGame.name, Validators.required),
            description: new FormControl(this.newGame.description),
            nPlayers: new FormControl(this.newGame.nPlayers, Validators.required),
            gameType: new FormControl(this.newGame.gameType, Validators.required),
            imageCover: new FormControl(null),
            imageCoverSource: new FormControl(null),
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
        Object.keys(this.gameForm.value).forEach((key: string) => {
             this.newGame[key] = this.gameForm.value[key] ? this.gameForm.value[key] : this.newGame[key];
        });

        // TODO Fix this new FormData in the future
        const formData = new FormData();
        // formData.append('file', this.gameForm.get('imageCoverSource').value);

        Object.keys(this.gameForm.value).forEach((key: string) => {
            const value = this.gameForm.value[key] ? this.gameForm.value[key] : this.newGame[key];
            formData.append(key.toString(), value);
        });
        this.saveGame.emit({game: this.newGame, formData: formData});
    }

    imageChanged(file: File): void {
        console.log('imageChanged', file);
        this.gameForm.patchValue({imageCoverSource: file});
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

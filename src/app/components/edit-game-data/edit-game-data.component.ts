import {Component,  Inject, NgZone, OnInit} from '@angular/core';
import { Game, GameTypes } from 'src/app/classes/Game';
import {UntypedFormControl, UntypedFormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {User} from '../../classes/User';

@Component({
    selector: 'app-edit-game-data',
    templateUrl: './edit-game-data.component.html',
    styleUrls: ['./edit-game-data.component.scss']
})
export class EditGameDataComponent implements OnInit {
    game: Game;
    gameName: string;
    gameForm: UntypedFormGroup;
    newGame: Game;
    gameTypes: string[] = [];
    loaded: boolean = false;
    previewImage: any;

    constructor(
        private dialogRef: MatDialogRef<Game>,
        private ngZone: NgZone,
        @Inject(MAT_DIALOG_DATA) public data: Game
    ) {
        this.game = data;
        console.log('data', data);
    }

    ngOnInit(): void {
        this.newGame = Game.fromJSON(this.game);
        this.gameForm = new UntypedFormGroup({
            name: new UntypedFormControl(this.newGame.name, Validators.required),
            description: new UntypedFormControl(this.newGame.description),
            nPlayers: new UntypedFormControl(this.newGame.maxNPlayers, Validators.required),
            gameType: new UntypedFormControl(this.newGame.gameType, Validators.required),
            imageCover: new UntypedFormControl(null),
            imageCoverSource: new UntypedFormControl(null),
            published: new UntypedFormControl(this.newGame.published, Validators.required),
        });
        this.gameTypes = Object.values(GameTypes);
        setTimeout(() => {
            this.loaded = true;
        }, 1000);

        this.gameName = this.game.name;
    }

    closeDialog(): void {
        this.ngZone.run(() => {
            this.dialogRef.close();
        });
    }

    saveChanges(): void {
        Object.keys(this.gameForm.value).forEach((key: string) => {
             this.newGame[key] = this.gameForm.value[key] ? this.gameForm.value[key] : this.newGame[key];
        });
        this.newGame.published = this.gameForm.get('published').value;
        this.newGame.maxNPlayers = this.gameForm.get('nPlayers').value;
        this.dialogRef.close({game: this.newGame, formData: this.gameForm.get('imageCoverSource').value});
    }

    imageChanged(formData: FormData): void {
        this.gameForm.patchValue({imageCoverSource: formData});
    }
}

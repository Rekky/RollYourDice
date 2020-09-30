import { Component, OnInit } from '@angular/core';
import {Character} from '../../classes/Character';
import {CharacterInteractor} from '../../interactors/CharacterInteractor';

@Component({
    selector: 'app-character-sheet',
    templateUrl: './character-sheet.component.html',
    styleUrls: ['./character-sheet.component.scss']
})
export class CharacterSheetComponent implements OnInit {

    character: Character;

    constructor(private characterInteractor: CharacterInteractor) { }

    ngOnInit(): void {
        this.characterInteractor.getCharacter().subscribe(res => {
            this.character = res;
        });
    }

}

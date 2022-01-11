import {Component, OnDestroy, OnInit} from '@angular/core';
import {Character} from '../../classes/Character';
import {CharacterInteractor} from '../../interactors/CharacterInteractor';
import {Subscription} from 'rxjs';

@Component({
    selector: 'app-character-sheet',
    templateUrl: './character-sheet.component.html',
    styleUrls: ['./character-sheet.component.scss']
})
export class CharacterSheetComponent implements OnInit, OnDestroy {

    character: Character;

    getCharacterSubs: Subscription;

    constructor(private characterInteractor: CharacterInteractor) { }

    ngOnInit(): void {
        this.getCharacterSubs = this.characterInteractor.getCharacter().subscribe(res => {
            this.character = res;
        });
    }

    ngOnDestroy(): void {
        if (this.getCharacterSubs) {
            this.getCharacterSubs.unsubscribe();
        }
    }

}

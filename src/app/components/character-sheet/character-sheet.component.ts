import {Component, OnDestroy, OnInit} from '@angular/core';
import {CharacterInteractor} from '../../interactors/CharacterInteractor';
import {Subscription} from 'rxjs';
import {CHARACTER} from '../../classes/Actor';

@Component({
    selector: 'app-character-sheet',
    templateUrl: './character-sheet.component.html',
    styleUrls: ['./character-sheet.component.scss']
})
export class CharacterSheetComponent implements OnInit, OnDestroy {

    character: CHARACTER;

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

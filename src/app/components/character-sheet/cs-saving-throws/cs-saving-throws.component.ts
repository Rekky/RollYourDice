import {Component, Input, OnInit} from '@angular/core';
import {SavingThrows} from '../../../classes/character-properties/saving-throws';

@Component({
    selector: 'app-cs-saving-throws',
    templateUrl: './cs-saving-throws.component.html',
    styleUrls: ['./cs-saving-throws.component.scss']
})
export class CsSavingThrowsComponent implements OnInit {

    @Input() savingThrows: SavingThrows;

    constructor() { }

    ngOnInit(): void {
    }

}

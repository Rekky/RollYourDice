import {Component, Input, OnInit} from '@angular/core';
import {Character} from '../../../classes/Character';

@Component({
    selector: 'app-cs-header',
    templateUrl: './cs-header.component.html',
    styleUrls: ['./cs-header.component.scss']
})
export class CsHeaderComponent implements OnInit {

    @Input() character: Character;

    constructor() { }

    ngOnInit(): void {
    }

}

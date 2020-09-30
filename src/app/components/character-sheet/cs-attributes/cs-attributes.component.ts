import {Component, Input, OnInit} from '@angular/core';
import {Character} from '../../../classes/Character';
import { Attributes } from 'src/app/classes/character-properties/attributes';

@Component({
    selector: 'app-cs-attributes',
    templateUrl: './cs-attributes.component.html',
    styleUrls: ['./cs-attributes.component.scss']
})
export class CsAttributesComponent implements OnInit {

    @Input() attributes: Attributes;

    constructor() { }

    ngOnInit(): void {
    }
}

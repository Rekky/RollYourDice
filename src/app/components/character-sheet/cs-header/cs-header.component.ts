import {Component, Input, OnInit} from '@angular/core';
import {CHARACTER} from '../../../classes/Actor';


@Component({
    selector: 'app-cs-header',
    templateUrl: './cs-header.component.html',
    styleUrls: ['./cs-header.component.scss']
})
export class CsHeaderComponent implements OnInit {

    @Input() character: CHARACTER;

    constructor() { }

    ngOnInit(): void {
    }

}

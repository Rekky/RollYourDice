import {Component, Input, OnInit} from '@angular/core';

@Component({
    selector: 'app-mini-menu',
    templateUrl: './mini-menu.component.html',
    styleUrls: ['./mini-menu.component.scss']
})
export class MiniMenuComponent implements OnInit {

    @Input() open: boolean = false;

    constructor() {
    }

    ngOnInit(): void {
    }

}

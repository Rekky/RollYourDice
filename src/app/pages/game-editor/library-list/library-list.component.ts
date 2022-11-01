import {Component, OnInit} from '@angular/core';

@Component({
    selector: 'app-library-list',
    templateUrl: './library-list.component.html',
    styleUrls: ['./library-list.component.scss']
})
export class LibraryListComponent implements OnInit {

    tabs: number = 0;

    constructor() {

    }

    ngOnInit(): void {
        //
    }

}

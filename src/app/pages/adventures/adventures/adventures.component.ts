import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-adventures',
    templateUrl: './adventures.component.html',
    styleUrls: ['./adventures.component.scss']
})
export class AdventuresComponent implements OnInit {

    cellXRow: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];

    constructor() { }

    ngOnInit(): void {
    }

}

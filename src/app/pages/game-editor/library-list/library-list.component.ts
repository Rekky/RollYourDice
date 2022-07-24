import {Component, OnInit} from '@angular/core';

@Component({
    selector: 'app-library-list',
    templateUrl: './library-list.component.html',
    styleUrls: ['./library-list.component.scss']
})
export class LibraryListComponent implements OnInit {

    categories: any[] = [];
    currentCategory: string | null = null;
    modalNewCategoryItem: boolean = false;

    constructor() {
    }

    ngOnInit(): void {
    }

    selectCategory(category: string): void {
        this.currentCategory = category;
    }

    onAddItem(): void {
        this.modalNewCategoryItem = true;
    }

}

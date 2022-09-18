import {Component, Input, OnInit} from '@angular/core';

@Component({
    selector: 'app-library-list',
    templateUrl: './library-list.component.html',
    styleUrls: ['./library-list.component.scss']
})
export class LibraryListComponent implements OnInit {

    categories: any[] = [];
    currentCategory: string | null = null;
    modalNewCategoryItem: boolean = false;
    @Input() library: any[] = [];

    constructor() {
    }

    ngOnInit(): void {
        // this.getLibraryItems();
    }

    getLibraryItems(): any[] {
        if (this.currentCategory) {
            return this.library.filter(item => item.type === this.currentCategory);
        }
        return [];
    }

    selectCategory(category: string): void {
        this.currentCategory = category;
    }

    onAddItem(): void {
        this.modalNewCategoryItem = true;
    }

}

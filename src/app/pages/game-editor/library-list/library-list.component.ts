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

    libraryItems: any[] = [
        {
            category: 'Characters', items: [
                {name: 'Character 1', description: 'This is a character', type: 'character', uri: 'https://picsum.photos/200/300'},
                {name: 'Character 2', description: 'This is a character', type: 'character', uri: 'https://picsum.photos/200/300'},
                {name: 'Character 3', description: 'This is a character', type: 'character', uri: 'https://picsum.photos/200/300'},
                {name: 'Character 4', description: 'This is a character', type: 'character', uri: 'https://picsum.photos/200/300'},
            ]
        },
    ];

    constructor() {
    }

    ngOnInit(): void {
        this.getLibraryItems();
    }

    getLibraryItems(): any[] {
        if (this.currentCategory) {
            return this.libraryItems.filter(item => item.category === this.currentCategory);
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

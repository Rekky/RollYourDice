import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {Page} from '../../../classes/Page';

@Component({
    selector: 'app-pages-list',
    templateUrl: './pages-list.component.html',
    styleUrls: ['./pages-list.component.scss']
})
export class PagesListComponent implements OnInit {

    @Input() pages: Page[] = [];
    @Output() selectedPage: EventEmitter<Page> = new EventEmitter<Page>();

    showNewPageForm: boolean = false;
    currentPage: Page = null;
    newPageForm: FormGroup;
    listHeight: number = 300;

    constructor() { }

    ngOnInit(): void {
        this.newPageForm = new FormGroup({
            name: new FormControl('Page' + (this.pages.length + 1)),
        });
    }

    onSelectPage(page: Page): void {
        this.currentPage = page;
        this.selectedPage.emit(this.currentPage);
    }

    onAddNewPage(): void {
        const newPage: Page = new Page();
        this.pages.push(newPage);
        this.newPageForm.reset({name: 'Page' + (this.pages.length + 1)});
        this.showNewPageForm = false;
    }

    setListHeight(ev: MouseEvent): void {
        this.listHeight = ev.clientY;
    }

}

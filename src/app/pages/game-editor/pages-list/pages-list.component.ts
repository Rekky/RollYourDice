import {ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
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
    @Input() currentPage: Page = null;
    newPageForm: FormGroup;

    constructor(private ref: ChangeDetectorRef) { }

    ngOnInit(): void {
        this.newPageForm = new FormGroup({
            name: new FormControl('new Page'),
        });
    }

    onSelectPage(page: Page): void {
        this.currentPage = page;
        this.selectedPage.emit(this.currentPage);
    }

    onAddNewPage(): void {
        const newPage: Page = new Page();
        newPage.name = this.newPageForm.get('name').value;

        this.pages.push(newPage);
        this.newPageForm.reset({name: 'Page' + (this.pages.length + 1)});
        this.showNewPageForm = false;
    }

}

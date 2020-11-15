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
    @Input() currentPage: Page = null;

    @Output() pagesChangesEvent: EventEmitter<Page[]> = new EventEmitter<Page[]>();
    @Output() selectedPageEvent: EventEmitter<Page> = new EventEmitter<Page>();
    @Output() newPageEvent: EventEmitter<Page> = new EventEmitter<Page>();
    @Output() removePageEvent: EventEmitter<Page> = new EventEmitter<Page>();
    @Output() renamePageEvent: EventEmitter<Page> = new EventEmitter<Page>();

    showNewPageForm: boolean = false;
    showRenamePageForm: boolean = false;

    newPageForm: FormGroup;
    renamePageForm: FormGroup;
    pageToRename: Page;

    constructor(private ref: ChangeDetectorRef) { }

    ngOnInit(): void {
        this.newPageForm = new FormGroup({
            name: new FormControl('Page' + (this.pages.length + 1)),
        });
    }

    onSelectPage(page: Page): void {
        this.currentPage = page;
        this.selectedPageEvent.emit(this.currentPage);
    }

    onAddNewPage(): void {
        const newPage: Page = new Page();
        newPage.name = this.newPageForm.get('name').value;

        this.pages.push(newPage);
        this.newPageForm.reset({name: 'Page' + (this.pages.length + 1)});
        this.showNewPageForm = false;
        this.newPageEvent.emit(newPage);
    }

    onSortPages(): void {
        this.pagesChangesEvent.emit(this.pages);
    }

    onSubmitRenamePage(page: Page): void {
        const newName = this.renamePageForm.get('name').value;
        const pageIndex = this.pages.indexOf(page);
        this.pages[pageIndex].name = newName;
        this.showRenamePageForm = false;

        this.renamePageEvent.emit(this.pages[pageIndex]);
    }

    renamePage(page: Page): void {
        this.showRenamePageForm = true;
        this.pageToRename = page;
        this.renamePageForm = new FormGroup({
            name: new FormControl(page.name),
        });
    }

    removePage(page: Page): void {
        this.pages.splice(this.pages.indexOf(page), 1);
        this.removePageEvent.emit(page);
    }

}

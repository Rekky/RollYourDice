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
    @Output() pagesChanges: EventEmitter<Page[]> = new EventEmitter<Page[]>();
    @Output() selectedPage: EventEmitter<Page> = new EventEmitter<Page>();
    @Output() newPage: EventEmitter<Page> = new EventEmitter<Page>();

    @Input() currentPage: Page = null;
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
        this.selectedPage.emit(this.currentPage);
    }

    onAddNewPage(): void {
        const newPage: Page = new Page();
        newPage.name = this.newPageForm.get('name').value;

        this.pages.push(newPage);
        this.newPageForm.reset({name: 'Page' + (this.pages.length + 1)});
        this.showNewPageForm = false;
        this.newPage.emit(newPage);
    }

    onSortPages(): void {
        this.pagesChanges.emit(this.pages);
    }

    onSubmitRenamePage(page: Page): void {
        const newName = this.renamePageForm.get('name').value;
        const pageIndex = this.pages.indexOf(page);
        this.pages[pageIndex].name = newName;
        this.showRenamePageForm = false;
        this.pagesChanges.emit(this.pages);
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
        this.pagesChanges.emit(this.pages);
    }

}

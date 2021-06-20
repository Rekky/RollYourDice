import {ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {Folder} from '../../../classes/Folder';

@Component({
    selector: 'app-pages-list',
    templateUrl: './pages-list.component.html',
    styleUrls: ['./pages-list.component.scss']
})
export class PagesListComponent implements OnInit {

    @Input() pages: Folder[] = [];
    @Input() currentPage: Folder = null;

    @Output() pagesChangesEvent: EventEmitter<Folder[]> = new EventEmitter<Folder[]>();
    @Output() selectedPageEvent: EventEmitter<Folder> = new EventEmitter<Folder>();
    @Output() newPageEvent: EventEmitter<Folder> = new EventEmitter<Folder>();
    @Output() removePageEvent: EventEmitter<Folder> = new EventEmitter<Folder>();
    @Output() renamePageEvent: EventEmitter<Folder> = new EventEmitter<Folder>();

    showNewPageForm: boolean = false;
    showRenamePageForm: boolean = false;

    newPageForm: FormGroup;
    renamePageForm: FormGroup;
    pageToRename: Folder;

    constructor(private ref: ChangeDetectorRef) { }

    ngOnInit(): void {
        this.newPageForm = new FormGroup({
            name: new FormControl('Page' + (this.pages.length + 1)),
        });
    }

    onSelectPage(page: Folder): void {
        this.currentPage = page;
        this.selectedPageEvent.emit(this.currentPage);
    }

    onAddNewPage(): void {
        const newPage: Folder = new Folder();
        newPage.name = this.newPageForm.get('name').value;

        this.pages.push(newPage);
        this.newPageForm.reset({name: 'Page' + (this.pages.length + 1)});
        this.showNewPageForm = false;
        this.newPageEvent.emit(newPage);
    }

    onSortPages(): void {
        this.pagesChangesEvent.emit(this.pages);
    }

    onSubmitRenamePage(page: Folder): void {
        const newName = this.renamePageForm.get('name').value;
        const pageIndex = this.pages.indexOf(page);
        this.pages[pageIndex].name = newName;
        this.showRenamePageForm = false;

        this.renamePageEvent.emit(this.pages[pageIndex]);
    }

    renamePage(page: Folder): void {
        this.showRenamePageForm = true;
        this.pageToRename = page;
        this.renamePageForm = new FormGroup({
            name: new FormControl(page.name),
        });
    }

    removePage(page: Folder): void {
        this.pages.splice(this.pages.indexOf(page), 1);
        this.removePageEvent.emit(page);
        page.maps = [];
    }

}

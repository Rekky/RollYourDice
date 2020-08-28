import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Page} from '../../interfaces/Game';
import {FormControl, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-pages-list',
  templateUrl: './pages-list.component.html',
  styleUrls: ['./pages-list.component.scss']
})
export class PagesListComponent implements OnInit {

  @Input() pages: Page[] = [];
  @Output() pagesChanges: EventEmitter<Page[]> = new EventEmitter<Page[]>();
  @Output() selectedPage: EventEmitter<Page> = new EventEmitter<Page>();

  showNewPageForm: boolean = false;
  currentSelectedPage: Page = null;
  newPageForm: FormGroup ;

  constructor() { }

  ngOnInit(): void {
    this.newPageForm = new FormGroup({
      name: new FormControl('Page' + (this.pages.length + 1)),
    });
  }

  onSelectPage(page: Page): void {
    this.currentSelectedPage = page;
    this.selectedPage.emit(this.currentSelectedPage);
  }

  onAddNewPage(): void {
    const newPage: Page = {id: '-1', name: this.newPageForm.get('name').value, layers: []};
    this.pages.push(newPage);
    this.newPageForm.reset({name: 'Page' + (this.pages.length + 1)});
    this.showNewPageForm = false;
  }

}

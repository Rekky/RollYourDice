import {Injectable} from '@angular/core';
import {Page} from '../classes/Page';
import {BehaviorSubject, Observable} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class PageInteractor {

    private selectedPage: BehaviorSubject<Page | null> = new BehaviorSubject<Page | null>(null);

    constructor() {}

    setCurrentPage(page: Page): void {
        this.selectedPage.next(page);
    }

    getCurrentPageObs(): Observable<Page> {
        return this.selectedPage.asObservable();
    }
}

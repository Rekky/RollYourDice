import {Injectable} from '@angular/core';
import {Folder} from '../classes/Folder';
import {BehaviorSubject, Observable} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class PageInteractor {

    private selectedPage: BehaviorSubject<Folder | null> = new BehaviorSubject<Folder | null>(null);

    constructor() {}

    setCurrentPage(page: Folder): void {
        this.selectedPage.next(page);
    }

    getCurrentPageObs(): Observable<Folder> {
        return this.selectedPage.asObservable();
    }
}

import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {LibraryService} from '../services/library.service';
import {Actor} from '../classes/Actor';


@Injectable({
    providedIn: 'root'
})
export class LibraryInteractor {
    private library: BehaviorSubject<Actor[]> = new BehaviorSubject<Actor[]>([]);

    constructor(private libraryService: LibraryService) {
        // this.libraryService.getLibrarySection('').subscribe((res: any) => {
        //     this.library.next(res);
        // });
    }

    getCurrentLibraryObs(): Observable<any> {
        return this.library.asObservable();
    }

    async createActor(actor: Actor): Promise<any> {
        this.library.value.push(actor);
        await this.libraryService.createActor(actor);
    }
}

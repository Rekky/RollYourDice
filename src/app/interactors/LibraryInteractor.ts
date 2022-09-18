import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {LibraryService} from '../services/library.service';
import {Actor} from '../classes/Actor';


@Injectable({
    providedIn: 'root'
})
export class LibraryInteractor {
    private actors: BehaviorSubject<Actor[]> = new BehaviorSubject<Actor[]>([]);

    constructor(private libraryService: LibraryService) {
       this.getMyActors().subscribe((res) => {
           this.actors.next(res.data);
       });
    }

    getCurrentLibraryObs(): Observable<any> {
        return this.actors.asObservable();
    }

    getMyActors(): Observable<any> {
        return this.libraryService.getMyActors();
    }

    async createActor(actor: Actor): Promise<any> {
        await this.libraryService.createActor(actor);
        this.getMyActors().subscribe((res) => this.actors.next(res.data));
    }
}

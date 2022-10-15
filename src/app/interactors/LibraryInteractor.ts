import {Injectable, OnDestroy} from '@angular/core';
import {BehaviorSubject, from, Observable, Subscription} from 'rxjs';
import {LibraryService} from '../services/library.service';
import {Actor} from '../classes/Actor';


@Injectable({
    providedIn: 'root'
})
export class LibraryInteractor implements OnDestroy {
    private actors$: BehaviorSubject<Actor[]> = new BehaviorSubject<Actor[]>([]);
    private actorsSub$: Subscription;

    constructor(private libraryService: LibraryService) {}

    ngOnDestroy(): void {
        if (this.actorsSub$) {
            this.actorsSub$.unsubscribe();
        }
    }

    public getCurrentLibraryObs(): Observable<any> {
        return this.actors$.asObservable();
    }

    public async getMyActors(type?: string): Promise<any> {
        return await this.libraryService.getMyActorsFromApi(type);
    }

    public async createActor(actor: Actor): Promise<any> {
        await this.libraryService.createActorFromApi(actor);
        await from(this.getMyActors()).subscribe((res) => this.actors$.next(res.data));
    }

    public async deleteActor(actor): Promise<void> {
        return await this.libraryService.deleteActorFromApi(actor.id);
    }
}

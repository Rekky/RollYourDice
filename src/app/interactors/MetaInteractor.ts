import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {Meta} from '../classes/Meta';

@Injectable({
    providedIn: 'root'
})
export class MetaInteractor {

    private $userMeta: BehaviorSubject<Meta | null> = new BehaviorSubject<Meta>(null);

    constructor() {

    }

    public setUserMeta(meta: Meta): void {
        this.$userMeta.next(meta);
    }

    public getUserMeta(): Meta {
        return this.$userMeta.getValue();
    }

    public getUserMetaObs(): Observable<Meta> {
        return this.$userMeta.asObservable();
    }

}

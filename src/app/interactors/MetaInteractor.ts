import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {Meta} from '../classes/Meta';

@Injectable({
    providedIn: 'root'
})
export class MetaInteractor {

    $userMeta: BehaviorSubject<Meta> = new BehaviorSubject<Meta>(null);

    constructor() {

    }

}

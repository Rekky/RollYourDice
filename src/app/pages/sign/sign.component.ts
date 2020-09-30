import {Component, OnDestroy, OnInit} from '@angular/core';
import {User} from '../../classes/User';
import {UserInteractor} from '../../interactors/UserInteractor';
import {Subscription} from 'rxjs';

@Component({
    selector: 'app-sign',
    templateUrl: './sign.component.html',
    styleUrls: ['./sign.component.scss']
})
export class SignComponent implements OnInit, OnDestroy {

    getCurrentUserSub: Subscription;

    isLogged: boolean = false;
    constructor(private userInteractor: UserInteractor) {
        this.getCurrentUserSub = this.userInteractor.getCurrentUserObs().subscribe((user: User) => {
            this.isLogged = user !== null;
        });
    }

    ngOnInit(): void {
    }

    ngOnDestroy(): void {
        if (this.getCurrentUserSub) {
            this.getCurrentUserSub.unsubscribe();
        }
    }

}

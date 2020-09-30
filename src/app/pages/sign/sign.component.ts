import {Component, OnDestroy, OnInit} from '@angular/core';
import {User} from '../../classes/User';
import {UserInteractor} from '../../interactors/UserInteractor';
import {Subscription} from 'rxjs';
import {
    trigger,
    state,
    style,
    animate,
    transition,
} from '@angular/animations';

@Component({
    selector: 'app-sign',
    animations: [
        trigger('leftBox', [
            state('open', style({
                width: '50%',
                borderRight: '1px solid #EAEAEA'
            })),
            state('closed', style({
                width: '100%',
                borderRight: 'none'
            })),
            transition('open => closed', [
                animate('1s')
            ]),
            transition('closed => open', [
                animate('0.5s')
            ]),
        ]),
        trigger('rightBox', [
            state('open', style({
                width: '50%',
                borderLeft: '1px solid #EAEAEA'
            })),
            state('closed', style({
                width: '0',
                borderLeft: 'none'
            })),
            transition('open => closed', [
                animate('0.5s')
            ]),
            transition('closed => open', [
                animate('0.5s')
            ]),
        ])
    ],
    templateUrl: './sign.component.html',
    styleUrls: ['./sign.component.scss']
})
export class SignComponent implements OnInit, OnDestroy {

    getCurrentUserSub: Subscription;
    test: string = 'open';

    isLogged: boolean = false;
    constructor(private userInteractor: UserInteractor) {
        this.getCurrentUserSub = this.userInteractor.getCurrentUserObs().subscribe((user: User) => {
            this.isLogged = user !== null;
            console.log('loged =', this.isLogged);
            if (this.isLogged) {
                this.test = 'closed';
            } else {
                this.test = 'open';
            }
        });
    }

    ngOnInit(): void {
    }

    ngOnDestroy(): void {
        if (this.getCurrentUserSub) {
            this.getCurrentUserSub.unsubscribe();
        }
    }

    leave(): void {
        this.userInteractor.logout();
    }

}

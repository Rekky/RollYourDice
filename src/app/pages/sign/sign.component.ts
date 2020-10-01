import {Component, OnDestroy, OnInit} from '@angular/core';
import {User} from '../../classes/User';
import {UserInteractor} from '../../interactors/UserInteractor';
import {Subscription} from 'rxjs';
import {
    trigger,
    state,
    style,
    animate,
    transition, stagger, query,
} from '@angular/animations';

@Component({
    selector: 'app-sign',
    animations: [
        trigger('leftBox', [
            state('signIn', style({
                width: '50%',
                borderRight: '1px solid #EAEAEA'
            })),
            state('signUp', style({
                width: '50%',
                borderRight: '1px solid #EAEAEA'
            })),
            state('loading', style({
                width: '100%',
                borderRight: 'none'
            })),
            transition('* => *', [
                animate('0.5s')
            ])
        ]),
        trigger('rightBox', [
            state('signIn', style({
                width: '50%',
                borderLeft: '1px solid #EAEAEA'
            })),
            state('signUp', style({
                width: '50%',
                borderLeft: '1px solid #EAEAEA'
            })),
            state('loading', style({
                width: '0',
                borderLeft: 'none'
            })),
            transition('* => *', [
                animate('0.5s')
            ])
        ])
    ],
    templateUrl: './sign.component.html',
    styleUrls: ['./sign.component.scss']
})
export class SignComponent implements OnInit, OnDestroy {

    getCurrentUserSub: Subscription;
    display: 'signIn' | 'signUp' | 'loading' = 'signIn';

    constructor(private userInteractor: UserInteractor) {
        this.getCurrentUserSub = this.userInteractor.getCurrentUserObs().subscribe((user: User) => {
            if (user !== null) {
                this.display = 'loading';
            } else {
                this.display = 'signIn';
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

    changeDisplay(display: any): void {
        // this.display = 'loading';
        // setTimeout(() => {
            this.display = display;
        // }, 500);
    }

}

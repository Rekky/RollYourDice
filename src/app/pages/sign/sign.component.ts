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
                transform: 'rotate(0deg)'
            })),
            state('signUp', style({
                width: '50%',
                transform: 'rotate(0deg)'
            })),
            state('loading', style({
                width: '100%',
                transform: 'rotate(360deg)'
            })),
            transition('loading => signIn', [
                animate('0.5s', style({
                    width: '50%',
                    transform: 'rotate(0deg)'
                }))
            ]),
            transition('loading => signUp', [
                animate('0.5s', style({
                    width: '50%',
                    transform: 'rotate(0deg)'
                }))
            ]),
            transition('* => loading', [
                animate('0.5s')
            ])
        ]),
        trigger('rightBox', [
            state('signIn', style({
                transform: 'translateX(0)',
                width: '50%',
                opacity: 1
            })),
            state('signUp', style({
                transform: 'translateX(0)',
                width: '50%',
                opacity: 1
            })),
            state('loading', style({
                transform: 'translateX(200%)',
                width: '0',
                opacity: 0
            })),
            transition('loading => signIn', [
                animate('0.5s')
            ]),
            transition('loading => signUp', [
                animate('0.5s')
            ]),
            transition('* => loading', [
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

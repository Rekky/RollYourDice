import { Component, OnInit } from '@angular/core';
import {User} from '../../classes/User';
import {UserInteractor} from '../../interactors/UserInteractor';

@Component({
    selector: 'app-sign',
    templateUrl: './sign.component.html',
    styleUrls: ['./sign.component.scss']
})
export class SignComponent implements OnInit {

    isLogged: boolean = false;
    constructor(private userInteractor: UserInteractor) {
        this.userInteractor.user.subscribe((user: User) => {
            if (user !== null) {
                this.isLogged = true;
            } else {
                this.isLogged = false;
            }
        });
    }

    ngOnInit(): void {
    }

}

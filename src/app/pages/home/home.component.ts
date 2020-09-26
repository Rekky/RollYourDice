import { Component, OnInit } from '@angular/core';
import {UserService} from '../../services/user.service';
import {UserInteractor} from '../../interactors/UserInteractor';
import {User} from '../../classes/User';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

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

    logout(): void {
        this.userInteractor.logout();
    }
}

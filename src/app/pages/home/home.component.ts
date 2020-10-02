import { Component, OnInit } from '@angular/core';
import {UserInteractor} from '../../interactors/UserInteractor';
import {Router} from '@angular/router';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

    constructor(private userInteractor: UserInteractor,
                private router: Router) {
    }

    ngOnInit(): void {
    }

    logout(): void {
        this.userInteractor.logout();
    }

    play(): void {
        this.router.navigate(['./sign']);
    }
}

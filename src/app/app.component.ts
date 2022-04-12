import {Component, OnInit} from '@angular/core';
import {UserInteractor} from './interactors/UserInteractor';
import {NavigationEnd, Router} from '@angular/router';
import {SocketService} from './services/socket.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {

    constructor(private userInteractor: UserInteractor,
                private socketService: SocketService,
                private router: Router) {
        // routing events
        this.router.events.subscribe((ev: any) => {
            if (ev instanceof NavigationEnd) {
                // nothing
            }
        });
    }

}

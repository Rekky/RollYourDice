import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import {UserInteractor} from '../interactors/UserInteractor';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {User} from '../classes/User';


@Injectable({ providedIn: 'root' })
export class AuthGuardService implements CanActivate {
    constructor(private router: Router, private userInteractor: UserInteractor) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
        return this.checkLogin();
    }

    checkLogin(): Observable<boolean> {
        return this.userInteractor.user.pipe(map((loggedIn: User) => {
            if (loggedIn) {
                return true;
            } else {
                this.router.navigate(['/sign-in']);
            }
            return false;
        }));
    }
}

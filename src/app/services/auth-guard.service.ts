import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import {UserInteractor} from '../interactors/UserInteractor';
import {JwtHelperService} from '@auth0/angular-jwt';


@Injectable({ providedIn: 'root' })
export class AuthGuardService implements CanActivate {

    constructor(private router: Router, private userInteractor: UserInteractor, public jwtHelper: JwtHelperService) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        const user = this.userInteractor.getCurrentUser();
        const token = this.userInteractor.getCurrentToken();

        console.log('isExpired?:', this.jwtHelper.isTokenExpired(token));

        if (this.jwtHelper.isTokenExpired(token)) {
            this.router.navigate(['/sign']);
            return false;
        }
        return true;
    }

}

import {Injectable} from '@angular/core';
import {UserService} from '../services/user.service';
import {BehaviorSubject, Observable} from 'rxjs';
import {User} from '../classes/User';
import {Router} from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class UserInteractor {

    private userSubject: BehaviorSubject<User> = new BehaviorSubject<User>(null);

    constructor(private userService: UserService, private router: Router ) {
        this.userSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('user')));
    }

    getCurrentUserObs(): Observable<User> {
        return this.userSubject.asObservable();
    }

    getCurrentUser(): User {
        return this.userSubject.getValue();
    }

    async signIn(email: string, password: string, stayLogged: boolean): Promise<any> {
        const user = await this.userService.signIn(email, password);
        console.log(user.body);
        if (user && stayLogged) {
            localStorage.setItem('user', JSON.stringify(user));
        }
        this.userSubject.next(user);
        return user;
    }

    async signUp(user: User): Promise<any> {
        return await this.userService.signUp(user);
    }

    logout(): void {
        localStorage.removeItem('user');
        this.userSubject.next(null);
        this.router.navigate(['/sign']);
    }
}

import {Injectable} from '@angular/core';
import {UserService} from '../services/user.service';
import {BehaviorSubject, Observable} from 'rxjs';
import {User} from '../classes/User';
import {Router} from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class UserInteractor {

    private userSubject: BehaviorSubject<User>;
    public user: Observable<User>;

    constructor(private userService: UserService, private router: Router ) {
        this.userSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('user')));
        this.user = this.userSubject.asObservable();
    }

    async signIn(email: string, password: string): Promise<any> {
        const res = await this.userService.signIn(email, password);
        this.userSubject.next(res);
        return res;
    }

    async signUp(user: User): Promise<any> {
        return await this.userService.signUp(user);
    }

    logout(): void {
        localStorage.removeItem('user');
        this.userSubject.next(null);
        this.router.navigate(['/sign-in']);
    }
}

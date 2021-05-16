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
        const token = this.getToken();
        if (token) {
            const user = localStorage.getItem('user');
            this.setUser(JSON.parse(user));
        }
    }

    async signIn(email: string, password: string, stayLogged: boolean): Promise<any> {
        const response = await this.userService.signIn(email, password);
        if (response.user) {
            this.setUser(response.user);
            this.setToken(response.token);
        }
        return response;
    }

    async signUp(user: User): Promise<any> {
        return await this.userService.signUp(user);
    }

    logout(): void {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        this.userSubject.next(null);
        this.router.navigate(['/sign']);
    }

    getUserObs(): Observable<User> {
        return this.userSubject.asObservable();
    }

    getUser(): User {
        return this.userSubject.getValue();
    }

    setUser(user: User): void {
        this.userSubject.next(user);
        localStorage.setItem('user', JSON.stringify(user));
    }

    getToken(): string {
        return localStorage.getItem('token');
    }

    setToken(text: string): void {
        localStorage.setItem('token', text);
    }
}

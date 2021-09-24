import {Injectable} from '@angular/core';
import {UserService} from '../services/user.service';
import {BehaviorSubject, Observable} from 'rxjs';
import {User} from '../classes/User';
import {StorageService} from '../services/storage.service';
import {Session} from '../classes/Session';

@Injectable({
    providedIn: 'root'
})
export class UserInteractor {

    private userSubject: BehaviorSubject<User> = new BehaviorSubject<User>(null);

    constructor(private userService: UserService, private storageService: StorageService) {
        const session = storageService.getCurrentSession();
        if (session) {
            console.log('EXISTS_SESSION', session);
            this.userSubject.next(session.user);
        }
    }

    async signIn(email: string, password: string, stayLogged: boolean): Promise<any> {
        const response = await this.userService.signIn(email, password);
        if (response.session) {
            this.setLoginSession(response.session);
        }
        return response;
    }

    async signUp(user: User): Promise<any> {
        return await this.userService.signUp(user);
    }

    logout(): void {
        this.storageService.removeCurrentSession();
        this.userSubject.next(null);
        window.location.reload();
    }

    setLoginSession(session: Session): void {
        this.storageService.setCurrentSession(session);
        this.userSubject.next(session.user);
    }

    getCurrentSession(): Session {
        return this.storageService.getCurrentSession();
    }

    getUserObs(): Observable<User> {
        return this.userSubject.asObservable();
    }

    getCurrentUser(): User {
        return this.userSubject.getValue();
    }

    getCurrentToken(): string {
        const session = this.getCurrentSession();
        return (session && session.token) ? session.token : null;
    }
}

import { Injectable } from '@angular/core';
import {Session} from '../classes/Session';

@Injectable({
    providedIn: 'root'
})
export class StorageService {

    private localStorageService = null;
    private currentSession: Session = null;

    constructor() {
        this.localStorageService = localStorage;
        this.currentSession = this.loadSessionData();
    }

    private loadSessionData(): Session {
        const sessionStr = this.localStorageService.getItem('rollSession');
        return (sessionStr) ? JSON.parse(sessionStr) : null;
    }

    setCurrentSession(session: Session): void {
        this.currentSession = session;
        this.localStorageService.setItem('rollSession', JSON.stringify(session));
    }

    getCurrentSession(): Session {
        return this.currentSession;
    }

    removeCurrentSession(): void {
        this.localStorageService.removeItem('rollSession');
        this.currentSession = null;
    }
}

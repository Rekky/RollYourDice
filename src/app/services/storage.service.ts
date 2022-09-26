import { Injectable } from '@angular/core';
import {Session} from '../classes/Session';
import {RollSettings} from '../classes/RollSettings';
import {BehaviorSubject, Observable} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class StorageService {

    private localStorageService = null;
    private currentSession: Session = null;
    public settings$: BehaviorSubject<RollSettings> = new BehaviorSubject<RollSettings>(null);

    constructor() {
        this.localStorageService = localStorage;
        this.currentSession = this.loadSessionData();

        // load settings
        if (!this.localStorageService.getItem('rollSettings')) {
            this.setDefaultsSettings();
        } else {
            const _settings = JSON.parse(this.localStorageService.getItem('rollSettings'));
            this.settings$.next(_settings);
        }

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

    setDefaultsSettings(): void {
        this.settings$.next({
            music: true
        });
        this.setSettings(this.settings$.value);
    }

    setSettings(settings: RollSettings): void {
        this.settings$.next({...this.settings$.value, ...settings});
        this.localStorageService.setItem('rollSettings', JSON.stringify(this.settings$.value));
    }
}

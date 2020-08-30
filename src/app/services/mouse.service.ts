import {ElementRef, Injectable} from '@angular/core';
import {Observable, BehaviorSubject, Subscriber} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class MouseService {

    mouse: BehaviorSubject<string> = new BehaviorSubject<string>('cursor');

    constructor() { }

    setMouse(type: string): void {
        this.mouse.next(type);
    }

    getMouseObservable(): Observable<string> {
        return this.mouse.asObservable();
    }

}

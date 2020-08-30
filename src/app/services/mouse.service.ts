import { Injectable } from '@angular/core';
import {Observable, Subject, Subscriber} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class MouseService {

    mouse: Subject<string> = new Subject<string>();

    constructor() { }

    setMouse(type: string): void {
        this.mouse.next(type);
    }

    getMouseObservable(): Observable<string> {
        return this.mouse.asObservable();
    }
}

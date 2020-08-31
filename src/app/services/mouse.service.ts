import {ElementRef, Injectable} from '@angular/core';
import {Observable, BehaviorSubject, Subscriber} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class MouseService {

    private mouse: BehaviorSubject<string> = new BehaviorSubject<string>('cursor');
    private dragImage: BehaviorSubject<any> = new BehaviorSubject<any>(null);

    constructor() { }

    setMouse(type: string): void {
        this.mouse.next(type);
    }

    setDragImage(url: any): void {
        this.dragImage.next(url);
    }

    getMouseObservable(): Observable<string> {
        return this.mouse.asObservable();
    }

    getDragImage(): Observable<any> {
        return this.dragImage.asObservable();
    }
}

export class DraggedImageAttributes {

}

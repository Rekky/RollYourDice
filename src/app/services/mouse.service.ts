import {ElementRef, Injectable} from '@angular/core';
import {Observable, BehaviorSubject, Subscriber} from 'rxjs';
import {Mouse} from '../classes/Mouse';

@Injectable({
    providedIn: 'root'
})
export class MouseService {

    private mouse: BehaviorSubject<Mouse> = new BehaviorSubject<Mouse>(new Mouse());
    private dragImage: BehaviorSubject<any> = new BehaviorSubject<any>(null);

    constructor() { }

    setMouse(type: Mouse): void {
        this.mouse.next(type);
    }

    setDragImage(url: any): void {
        this.dragImage.next(url);
    }

    getMouseObservable(): Observable<Mouse> {
        return this.mouse.asObservable();
    }

    getDragImageObservable(): Observable<any> {
        return this.dragImage.asObservable();
    }
}

export class DraggedImageAttributes {

}

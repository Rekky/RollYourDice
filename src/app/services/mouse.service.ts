import {ElementRef, Injectable} from '@angular/core';
import {Observable, BehaviorSubject, Subscriber} from 'rxjs';
import {OurKonvaObject} from '../classes/ourKonva/OurKonvaObject';

@Injectable({
    providedIn: 'root'
})
export class MouseService {
    private mouse: BehaviorSubject<OurKonvaObject> = new BehaviorSubject<OurKonvaObject>(null);
    private dragImage: BehaviorSubject<any> = new BehaviorSubject<any>(null);

    constructor() { }

    setMouse(type: OurKonvaObject): void {
        this.mouse.next(type);
    }

    setDragImage(url: any): void {
        this.dragImage.next(url);
    }

    getMouseObservable(): Observable<any> {
        return this.mouse.asObservable();
    }

    getDragImageObservable(): Observable<any> {
        return this.dragImage.asObservable();
    }
}

export class DraggedImageAttributes {

}

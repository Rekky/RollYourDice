import {ElementRef, Injectable} from '@angular/core';
import {Observable, BehaviorSubject, Subscriber} from 'rxjs';
import {OurKonvaMouse} from '../classes/ourKonva/OurKonvaMouse';

@Injectable({
    providedIn: 'root'
})
export class MouseService {
    private mouse: BehaviorSubject<OurKonvaMouse> = new BehaviorSubject<OurKonvaMouse>(null);
    private dragImage: BehaviorSubject<any> = new BehaviorSubject<any>(null);

    constructor() { }

    setMouse(type: OurKonvaMouse): void {
        this.mouse.next(type);
    }

    setDragImage(url: any): void {
        this.dragImage.next(url);
    }

    getMouseObservable(): Observable<OurKonvaMouse> {
        return this.mouse.asObservable();
    }

    getDragImageObservable(): Observable<any> {
        return this.dragImage.asObservable();
    }
}

export class DraggedImageAttributes {

}

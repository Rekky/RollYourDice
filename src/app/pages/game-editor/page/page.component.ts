import {Component, Input, OnDestroy, OnInit, HostListener} from '@angular/core';
import {Page} from '../../../classes/Page';
import {MouseService} from '../../../services/mouse.service';
import {Subscription} from 'rxjs';
import { Coords } from 'src/app/classes/Coords';

@Component({
    selector: 'app-page',
    templateUrl: './page.component.html',
    styleUrls: ['./page.component.scss']
})
export class PageComponent implements OnInit, OnDestroy {
    @HostListener('document:mousemove', ['$event'])
    setMousePosition(e: MouseEvent): void {
        if (this.draggedImage !== null) {
            this.attachImageToMouse(e);
        }
    }

    @Input() page: Page;

    getDragImageUrlSubscription: Subscription = new Subscription();
    draggedImage: any = null;

    constructor(private mouseService: MouseService) { }

    ngOnInit(): void {
        this.getDragImageUrlSubscription = this.mouseService.getDragImage().subscribe((res => {
            this.draggedImage = res;
        }));
    }

    ngOnDestroy(): void {
        if (this.getDragImageUrlSubscription) {
            this.getDragImageUrlSubscription.unsubscribe();
        }
    }

    attachImageToMouse(e: MouseEvent): void {
        const imageDiv = document.getElementById('draggedImage');
        const imagePosition: Coords = this.calculateImagePosition(e);
        imageDiv.style.left = imagePosition.x.toString() + 'px';
        imageDiv.style.top = imagePosition.y.toString() + 'px';
        imageDiv.style.width = this.draggedImage.width.toString() + 'px';
        imageDiv.style.height = this.draggedImage.height.toString() + 'px';
        imageDiv.style.opacity = '0.5';
    }

    calculateImagePosition(e: MouseEvent): Coords {
        const map = document.getElementById('mapbox' + this.draggedImage.mapId);
        const pos: Coords = new Coords();
        console.log(this.draggedImage.x + map.offsetLeft);
        pos.x = this.draggedImage.x + map.offsetLeft;
        pos.y = this.draggedImage.y + map.offsetTop;
        return pos;
    }

}

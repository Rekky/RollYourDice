import {
    ChangeDetectorRef,
    Component,
    ElementRef,
    EventEmitter,
    OnInit,
    Output,
    Renderer2,
    ViewChild
} from '@angular/core';
import {BaseBlueprintBox, BlueprintModel} from '../models/base-blueprint';
import {BlueprintsService} from './blueprints.service';
import {BlueprintLink, BlueprintNode} from '../models/blueprint-link';
import {Coords} from '../../classes/Coords';
import {Subscription} from 'rxjs';

@Component({
    selector: 'app-blueprints-interface',
    templateUrl: './blueprints-interface.component.html',
    styleUrls: ['./blueprints-interface.component.scss']
})
export class BlueprintsInterfaceComponent implements OnInit {
    @ViewChild('svg') svg: ElementRef;
    @ViewChild('droppable') droppable: ElementRef;
    @Output() closeBlueprints: EventEmitter<boolean> = new EventEmitter<boolean>();

    blueprint: BlueprintModel = new BlueprintModel();
    user: any;

    functionOnEventListener;
    temporalLink: BlueprintLink;

    constructor(private blueprintsService: BlueprintsService,
                private cdr: ChangeDetectorRef) { }

    ngOnInit(): void {
        this.blueprint = this.blueprintsService.getBlueprintData();
        this.cdr.detectChanges();
    }

    modifyBBPosition(coords: any, bb: BaseBlueprintBox): void {
        const newPos = new Coords(bb.position.x + coords.x, bb.position.y + coords.y);
        this.blueprint.blueprintLinks.forEach((link: BlueprintLink) => {
            if (link.startingNode.boxId === bb.id) {
                link.startingNode.position.x = link.startingNode.position.x + coords.x;
                link.startingNode.position.y = link.startingNode.position.y + coords.y;
                link.controlLinkPosition();
            }
            if (link.endingNode.boxId === bb.id) {
                link.endingNode.position.x = link.endingNode.position.x + coords.x;
                link.endingNode.position.y = link.endingNode.position.y + coords.y;
                link.controlLinkPosition();
            }
        });
        bb.position = newPos;
    }

    /**
     * returns the svg used to draw the link
     * @param link has to be a BlueprintLink type
     * @returns an svg
     */
    getSVGPath(link: BlueprintLink): string {
        // M 0 0 C135,0 135,320 270,320
        return `M ${(link.startingNode.position.x - link.position.x)} ${(link.startingNode.position.y - link.position.y) + 10}
        C${(link.endingNode.position.x - link.position.x) / 2},${(link.startingNode.position.y - link.position.y) + 10}
        ${(link.endingNode.position.x - link.position.x) / 2},${link.endingNode.position.y - link.position.y + 10}
        ${link.endingNode.position.x - link.position.x},${link.endingNode.position.y - link.position.y + 10}`;
    }

    getLinkWidth(link: BlueprintLink): number {
        return Math.abs(link.endingNode.position.x - link.startingNode.position.x);
    }

    getLinkHeight(link: BlueprintLink): number {
        return Math.abs(link.endingNode.position.y - link.startingNode.position.y) + 20;
    }

    newLinkNodeOut(node: BlueprintNode): void {
        if (this.temporalLink) {
            this.endsNewLinkNodeOut(node);
        } else {
            this.startsNewLinkNodeOut(node);
        }
    }

    startsNewLinkNodeOut(node: BlueprintNode): void {
        const newLink = new BlueprintLink();
        newLink.id = 'onlyOne';
        newLink.position.x = node.position.x;
        newLink.position.y = node.position.y;
        newLink.startingNode = node;
        const droppable = this.droppable;
        this.temporalLink = newLink;

        this.functionOnEventListener = function myListener(e): void {
            const bounds = droppable.nativeElement.getBoundingClientRect();
            const mouseX = e.clientX - bounds.left; // Gets Mouse X
            const mouseY = e.clientY - bounds.top; // Gets Mouse Y
            newLink.endingNode.boxId = 'second';
            newLink.endingNode.position.x = mouseX;
            newLink.endingNode.position.y = mouseY;
        };

        this.droppable.nativeElement.addEventListener('mousemove', this.functionOnEventListener, false);
    }

    endsNewLinkNodeOut(node: BlueprintNode): void {
        this.temporalLink.startingNode = node;
        this.blueprint.blueprintLinks.push(this.temporalLink);
        this.temporalLink = null;
        this.droppable.nativeElement.removeEventListener('mousemove', this.functionOnEventListener, false);
    }

    newLinkNodeIn(node: BlueprintNode): void {
        if (this.temporalLink) {
            this.endsNewLinkNodeIn(node);
        } else {
            this.startsNewLinkNodeIn(node);
        }
    }

    startsNewLinkNodeIn(node: BlueprintNode): void {
        const newLink = new BlueprintLink();
        newLink.id = 'onlyOne';
        newLink.position.x = node.position.x;
        newLink.position.y = node.position.y;
        newLink.endingNode = node;
        const droppable = this.droppable;
        this.temporalLink = newLink;

        this.functionOnEventListener = function myListener(e): void {
            const bounds = droppable.nativeElement.getBoundingClientRect();
            const mouseX = e.clientX - bounds.left; // Gets Mouse X
            const mouseY = e.clientY - bounds.top; // Gets Mouse Y
            newLink.startingNode.boxId = 'first';
            newLink.startingNode.position.x = mouseX;
            newLink.startingNode.position.y = mouseY;
        };

        this.droppable.nativeElement.addEventListener('mousemove', this.functionOnEventListener, false);
    }

    endsNewLinkNodeIn(node: BlueprintNode): void {
        this.temporalLink.endingNode = node;
        this.blueprint.blueprintLinks.push(this.temporalLink);
        this.temporalLink = null;
        this.droppable.nativeElement.removeEventListener('mousemove', this.functionOnEventListener, false);
    }

    elementDropped(object: any): void {}

    clickedBB(bb: any): void {
        console.log('hey');
    }

}

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
import {ulid} from 'ulid';
import {BBArea, BBEquals, BBGet, BBGetAllActors} from '../models/blueprint-boxes';

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
    temporalLink: BlueprintLink;
    selectedLink: BlueprintLink;

    droppableMouseMoveListener;
    selectedLinkDeleteListener;

    constructor(private blueprintsService: BlueprintsService,
                private cdr: ChangeDetectorRef) { }

    ngOnInit(): void {
        // this.blueprint = this.blueprintsService.getBlueprintData();
    }

    addBBArea(): void {
        this.blueprint.blueprintBoxes.push(new BBArea());
    }

    addBBGetAllActors(): void {
        this.blueprint.blueprintBoxes.push(new BBGetAllActors());
    }

    addBBEquals(): void {
        this.blueprint.blueprintBoxes.push(new BBEquals());
    }

    addBBGet(): void {
        this.blueprint.blueprintBoxes.push(new BBGet());
    }

    addBBMoveActorToLocation(): void {
        this.blueprint.blueprintBoxes.push(new BBGet());
    }

    modifyBBPosition(coords: any, bb: BaseBlueprintBox): void {
        const newPos = new Coords(bb.position.x + coords.x, bb.position.y + coords.y);
        this.blueprint.blueprintLinks.forEach((link: BlueprintLink) => {
            if (link.startingNode.boxId === bb.id) {
                link.startingNode.position.x += coords.x;
                link.startingNode.position.y += coords.y;
                link.controlLinkPosition();
            }
            if (link.endingNode.boxId === bb.id) {
                link.endingNode.position.x += coords.x;
                link.endingNode.position.y += coords.y;
                link.controlLinkPosition();
            }
        });
        bb.position = newPos;
    }

    elementDropped(object: any): void {}

    clickedBB(bb: any): void {
        console.log('hey');
    }


    // --------------- LINK STUFF -------------
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

    touchedNodeOut(node: BlueprintNode): void {
        if (this.isNodeUsed(node) && !this.temporalLink) {
            this.temporalLink = this.getLinkNodeUsed(node);
            this.moveNodeOut(this.temporalLink, node);
            return;
        }
        if (this.temporalLink) {
            this.endsNewLinkNodeOut(node);
            return;
        }
        this.startsNewLinkNodeOut(node);
    }

    isNodeUsed(node: BlueprintNode): boolean {
        const found = this.blueprint.blueprintLinks.find(link => link.startingNode.id === node.id || link.endingNode.id === node.id);
        return !!found;
    }

    getLinkNodeUsed(node: BlueprintNode): BlueprintLink {
        return this.blueprint.blueprintLinks.find(link => link.startingNode.id === node.id || link.endingNode.id === node.id);
    }

    startsNewLinkNodeOut(node: BlueprintNode): void {
        const newLink = new BlueprintLink();
        newLink.id = ulid();
        newLink.position.x = node.position.x;
        newLink.position.y = node.position.y;
        newLink.startingNode = node;
        newLink.endingNode.boxId = 'second';
        this.temporalLink = newLink;
        this.moveNodeIn(newLink, node);
    }

    moveNodeIn(link: BlueprintLink, node: BlueprintNode): void {
        const droppable = this.droppable;
        this.droppableMouseMoveListener = function myListener(e): void {
            const bounds = droppable.nativeElement.getBoundingClientRect();
            const mouseX = e.clientX - bounds.left; // Gets Mouse X
            const mouseY = e.clientY - bounds.top; // Gets Mouse Y
            link.endingNode.position.x = mouseX;
            link.endingNode.position.y = mouseY;
            link.position.x = mouseX < node.position.x ? mouseX : node.position.x;
            link.position.y = mouseY < node.position.y ? mouseY : node.position.y;
        };

        this.droppable.nativeElement.addEventListener('mousemove', this.droppableMouseMoveListener, false);
    }

    endsNewLinkNodeOut(node: BlueprintNode): void {
        this.temporalLink.startingNode = node;
        this.blueprint.blueprintLinks.push(this.temporalLink);
        this.temporalLink = null;
        this.droppable.nativeElement.removeEventListener('mousemove', this.droppableMouseMoveListener, false);
    }

    touchedNodeIn(node: BlueprintNode): void {
        if (this.isNodeUsed(node) && !this.temporalLink) {
            this.temporalLink = this.getLinkNodeUsed(node);
            this.moveNodeIn(this.temporalLink, node);
            return;
        }
        if (this.temporalLink) {
            this.endsNewLinkNodeIn(node);
            return;
        }
        this.startsNewLinkNodeIn(node);
    }

    startsNewLinkNodeIn(node: BlueprintNode): void {
        const newLink = new BlueprintLink();
        newLink.id = ulid();
        newLink.position.x = node.position.x;
        newLink.position.y = node.position.y;
        newLink.endingNode = node;
        newLink.startingNode.boxId = 'first';
        this.temporalLink = newLink;
        this.moveNodeOut(newLink, node);
    }

    moveNodeOut(link: BlueprintLink, node: BlueprintNode): void {
        const droppable = this.droppable;
        this.droppableMouseMoveListener = function newLinkListener(e): void {
            const bounds = droppable.nativeElement.getBoundingClientRect();
            const mouseX = e.clientX - bounds.left; // Gets Mouse X
            const mouseY = e.clientY - bounds.top; // Gets Mouse Y
            link.startingNode.position.x = mouseX;
            link.startingNode.position.y = mouseY;
            link.position.x = mouseX < node.position.x ? mouseX : node.position.x;
            link.position.y = mouseY < node.position.y ? mouseY : node.position.y;
        };

        this.droppable.nativeElement.addEventListener('mousemove', this.droppableMouseMoveListener, false);
    }

    endsNewLinkNodeIn(node: BlueprintNode): void {
        this.temporalLink.endingNode = node;
        this.blueprint.blueprintLinks.push(this.temporalLink);
        this.temporalLink = null;
        this.droppable.nativeElement.removeEventListener('mousemove', this.droppableMouseMoveListener, false);
    }

    toggleLinkSelection(link: BlueprintLink): void {
        document.removeEventListener('keydown', this.selectedLinkDeleteListener, false);
        if (this.selectedLink?.id === link?.id) {
            this.selectedLink = null;
            return;
        }
        this.selectedLink = link;
        const blueprint = this.blueprint;

        this.selectedLinkDeleteListener = function deleteLinkListener(e): void {
            if (e.keyCode === 46) {
                const index = blueprint.blueprintLinks.findIndex(sLink => {
                    return sLink.id === link.id;
                });
                blueprint.blueprintLinks.splice(index, 1);
            }
        };

        document.addEventListener('keydown', this.selectedLinkDeleteListener, false);
    }

    mouseHoversLink(e, link): void {
        if (link?.id === this.selectedLink?.id) { return; }
        e.target.previousElementSibling.style.stroke = '#CFB525';
    }

    mouseLeavesLink(e, link: BlueprintLink): void {
        if (link?.id === this.selectedLink?.id) { return; }
        e.target.previousElementSibling.style.stroke = '#FFFFFF';
    }

    cancelLink(): void {
        if (this.temporalLink) {
            const index = this.blueprint.blueprintLinks.findIndex(link => link.id === this.temporalLink.id);
            this.blueprint.blueprintLinks.splice(index, 1);
            this.temporalLink = null;
            this.droppable.nativeElement.removeEventListener('mousemove', this.droppableMouseMoveListener, false);
        }
    }

    clickedOnFrame(e): void {
        e.stopPropagation();
        this.cancelLink();
    }

}

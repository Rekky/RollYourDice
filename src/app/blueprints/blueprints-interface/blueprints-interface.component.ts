import {
    ChangeDetectorRef,
    Component,
    ElementRef,
    EventEmitter, Input,
    OnInit,
    Output,
    Renderer2,
    ViewChild
} from '@angular/core';
import {BlueprintModel, BlueprintRenderedModel} from '../models/base-blueprint';
import {BlueprintsService} from './blueprints.service';
import {BlueprintLink, BlueprintNode} from '../models/blueprint-link';
import {Coords} from '../../classes/Coords';
import {Subscription} from 'rxjs';
import {ulid} from 'ulid';
import {
    BaseBlueprintBox,
    BBArea,
    BBEquals,
    BBGet,
    BBGetAllActors,
    BBMoveActorToLocation, BBOnInit,
    BBOnOverlap
} from '../models/blueprint-boxes';
import {OurKonvaActor} from '../../classes/ourKonva/OurKonvaActor';
import {BlueprintInteractor} from '../../interactors/BlueprintInteractor';
import {Actor} from '../../classes/Actor';
import {MouseInteractor} from '../../interactors/MouseInteractor';

@Component({
    selector: 'app-blueprints-interface',
    templateUrl: './blueprints-interface.component.html',
    styleUrls: ['./blueprints-interface.component.scss']
})
export class BlueprintsInterfaceComponent implements OnInit {
    @ViewChild('svg') svg: ElementRef;
    @ViewChild('droppable') droppable: ElementRef;
    @Input() actor: Actor;

    blueprint: BlueprintRenderedModel = new BlueprintRenderedModel();
    user: any;
    temporalLink: BlueprintLink;
    selectedLink: BlueprintLink;

    droppableMouseMoveListener;
    selectedLinkDeleteListener;

    constructor(private blueprintsService: BlueprintsService,
                private blueprintInteractor: BlueprintInteractor,
                private cdr: ChangeDetectorRef,
                private mouseInteractor: MouseInteractor) { }

    ngOnInit(): void {
        this.blueprint = new BlueprintRenderedModel().toRendered(this.actor.blueprint);
        this.cdr.detectChanges();
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
        this.blueprint.blueprintBoxes.push(new BBMoveActorToLocation());
    }

    addBBOnInit(): void {
        this.blueprint.blueprintBoxes.push(new BBOnInit());
    }

    addBBOnOverlap(): void {
        this.blueprint.blueprintBoxes.push(new BBOnOverlap());
    }

    deleteBB(box: any): void {
        const index = this.blueprint.blueprintBoxes.findIndex(bb => bb.id === box.id);
        this.blueprint.blueprintLinks.map((link, i) => {
            if (link.startingNode.boxId === box.id || link.endingNode.boxId === box.id) {
                delete this.blueprint.blueprintLinks[i];
            }
        });
        this.blueprint.blueprintBoxes.splice(index, 1);
        this.cdr.detectChanges();
    }

    viewBluePrint(): void  {
        console.log('BLUEPRINT', this.blueprint);
    }

    saveBlueprint(): void {
        this.actor.blueprint = new BlueprintModel().fromRendered(this.blueprint);
        this.mouseInteractor.updateObject(this.actor);
    }

    modifyBBPosition(coords: any, bb: BaseBlueprintBox): void {
        const newPos = new Coords(bb.render.position.x + coords.x, bb.render.position.y + coords.y);
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
        bb.render.position = newPos;
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

    close(): void {
        this.blueprintInteractor.setDisplayedBlueprintActor(null);
    }

}

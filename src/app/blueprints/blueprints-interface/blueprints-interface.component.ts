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
import {BlueprintLink} from '../models/blueprint-link';
import {Coords} from '../../classes/Coords';

@Component({
    selector: 'app-blueprints-interface',
    templateUrl: './blueprints-interface.component.html',
    styleUrls: ['./blueprints-interface.component.scss']
})
export class BlueprintsInterfaceComponent implements OnInit {
    @ViewChild('svg') svg: ElementRef;
    @Output() closeBlueprints: EventEmitter<boolean> = new EventEmitter<boolean>();

    blueprint: BlueprintModel = new BlueprintModel();
    user: any;

    constructor(private blueprintsService: BlueprintsService,
                private cdr: ChangeDetectorRef) { }

    ngOnInit(): void {
        this.blueprint = this.blueprintsService.getBlueprintData();
        this.cdr.detectChanges();
    }

    openDetail(kio: any): void {
        console.log(kio);
    }

    modifyBBPosition(object: any): void {
        const bb = this.blueprint.blueprintBoxes.find(bbox => bbox.id === object.id);
        const newPos = new Coords(bb.position.x + object.x, bb.position.y + object.y);
        this.blueprint.blueprintLinks.forEach((link: BlueprintLink) => {
            if (link.startingNode.boxId === bb.id) {
                link.startingNode.position.x = link.startingNode.position.x + (newPos.x - bb.position.x);
                link.startingNode.position.y = link.startingNode.position.y + (newPos.y - bb.position.y);
                link.controlLinkPosition();
            }
            if (link.endingNode.boxId === bb.id) {
                link.endingNode.position.x = link.endingNode.position.x + (newPos.x - bb.position.x);
                link.endingNode.position.y = link.endingNode.position.y + (newPos.y - bb.position.y);
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

}

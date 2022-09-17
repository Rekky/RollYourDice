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
import { BlueprintModel } from '../models/base-blueprint';
import {BlueprintsService} from './blueprints.service';
import {BlueprintLink} from '../models/blueprint-link';

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

    assignTask(object: any): void {
        const bb = this.blueprint.blueprintBoxes.find(bbox => bbox.id === object.id);
        bb.position.y = bb.position.y + object.y;
        bb.position.x = bb.position.x + object.x;
    }

    getSVGPath(link: BlueprintLink): string {
        // M 0 0 C135,0 135,320 270,320
        return `M
        ${link.startingNode.position.x} ${link.startingNode.position.y}
        C${link.endingNode.position.x / 2},${link.startingNode.position.y}
        ${link.endingNode.position.x / 2},${link.endingNode.position.y}
        ${link.endingNode.position.x} ${link.endingNode.position.y}`;
    }

}

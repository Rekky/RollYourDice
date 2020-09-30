import {Component, Input, OnInit} from '@angular/core';
import {Skills} from '../../../classes/character-properties/skills';

@Component({
    selector: 'app-cs-skills',
    templateUrl: './cs-skills.component.html',
    styleUrls: ['./cs-skills.component.scss']
})
export class CsSkillsComponent implements OnInit {

    @Input() skills: Skills;

    constructor() { }

    ngOnInit(): void {
    }

}

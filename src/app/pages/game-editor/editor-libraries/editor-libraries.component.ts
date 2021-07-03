import { Component, OnInit } from '@angular/core';
import {LibraryService} from '../../../services/library.service';

@Component({
    selector: 'app-editor-libraries',
    templateUrl: './editor-libraries.component.html',
    styleUrls: ['./editor-libraries.component.scss']
})
export class EditorLibrariesComponent implements OnInit {

    librarySections = LibrarySections;
    selectedLibrarySection: LibrarySections;
    displayedData: any[];

    constructor(private libraryService: LibraryService) { }

    ngOnInit(): void {
        this.selectSection(LibrarySections.Monsters);
    }

    async selectSection(section: LibrarySections): Promise<void> {
        this.selectedLibrarySection = section;
        this.displayedData = await this.libraryService.getLibrarySection(section);
    }

}

export enum LibrarySections {
    Maps = 'maps',
    Monsters = 'monsters',
    Npcs = 'npcs',
    Assets = 'assets'
}

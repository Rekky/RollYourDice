import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatDialogModule} from '@angular/material/dialog';
import {GameEditorComponent} from './game-editor.component';
import {MapsListComponent} from './maps-list/maps-list.component';
import {EditorLibrariesComponent} from './editor-libraries/editor-libraries.component';
import {MapPropertiesComponent} from './map-properties/map-properties.component';
import {EditorToolsComponent} from '../../components/editor-tools/editor-tools.component';
import {SharedModule} from '../../shared.module';
import { GameEditorRoutingModule } from './game-editor-routing.module';

@NgModule({
    declarations: [
        GameEditorComponent,
        MapsListComponent,
        EditorLibrariesComponent,
        MapPropertiesComponent,
        EditorToolsComponent,
    ],
    imports: [
        CommonModule,
        HttpClientModule,
        FormsModule,
        GameEditorRoutingModule,
        ReactiveFormsModule,
        MatDialogModule,
        SharedModule
    ],
})

export class GameEditorModule { }

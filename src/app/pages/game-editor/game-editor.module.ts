import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatDialogModule} from '@angular/material/dialog';
import {GameEditorComponent} from './game-editor.component';
import {MapsListComponent} from './maps-list/maps-list.component';
import {MapPropertiesComponent} from './map-properties/map-properties.component';
import {EditorToolsComponent} from './editor-tools/editor-tools.component';
import {SharedModule} from '../../shared.module';
import { GameEditorRoutingModule } from './game-editor-routing.module';
import {KonvaBrushPropertiesComponent} from './konva-tools-properties/konva-brush-properties/konva-brush-properties.component';
import {KonvaEraserPropertiesComponent} from './konva-tools-properties/konva-eraser-properties/konva-eraser-properties.component';
import {KonvaTextPropertiesComponent} from './konva-tools-properties/konva-text-properties/konva-text-properties.component';
import {KonvaRectanglePropertiesComponent} from './konva-tools-properties/konva-rectangle-properties/konva-rectangle-properties.component';
import { ToolsUxComponent } from './editor-tools/tools-ux/tools-ux.component';
import { SelectedObjectEditorComponent } from './selected-object-editor/selected-object-editor.component';

@NgModule({
    declarations: [
        GameEditorComponent,
        MapsListComponent,
        MapPropertiesComponent,
        EditorToolsComponent,
        KonvaBrushPropertiesComponent,
        KonvaEraserPropertiesComponent,
        KonvaTextPropertiesComponent,
        KonvaRectanglePropertiesComponent,
        ToolsUxComponent,
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
    exports: []
})

export class GameEditorModule { }

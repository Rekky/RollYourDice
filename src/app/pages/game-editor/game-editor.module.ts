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
import {KonvaBrushPropertiesComponent} from './context-menu/konva-tools-properties/konva-brush-properties/konva-brush-properties.component';
import {KonvaEraserPropertiesComponent} from './context-menu/konva-tools-properties/konva-eraser-properties/konva-eraser-properties.component';
import {KonvaTextPropertiesComponent} from './context-menu/konva-tools-properties/konva-text-properties/konva-text-properties.component';
import {KonvaRectanglePropertiesComponent} from './context-menu/konva-tools-properties/konva-rectangle-properties/konva-rectangle-properties.component';
import { ToolsUxComponent } from './editor-tools/tools-ux/tools-ux.component';
import {MapComponent} from '../../components/map/map.component';
import {SelectedObjectEditorComponent} from './context-menu/selected-object-editor/selected-object-editor.component';
import { CoordsInputComponent } from './context-menu/custom-inputs/coords-input/coords-input.component';
import { FillColorComponent } from './context-menu/custom-inputs/fill-color/fill-color.component';
import { StrokeInputComponent } from './context-menu/custom-inputs/stroke-input/stroke-input.component';
import { ColorChromeModule } from 'ngx-color/chrome';
import {MatSliderModule} from '@angular/material/slider';
import { KickedMessageComponent } from './kicked-message/kicked-message.component';

@NgModule({
    declarations: [
        GameEditorComponent,
        MapComponent,
        MapsListComponent,
        MapPropertiesComponent,
        EditorToolsComponent,
        KonvaBrushPropertiesComponent,
        KonvaEraserPropertiesComponent,
        KonvaTextPropertiesComponent,
        KonvaRectanglePropertiesComponent,
        ToolsUxComponent,
        SelectedObjectEditorComponent,
        CoordsInputComponent,
        FillColorComponent,
        StrokeInputComponent,
        KickedMessageComponent,
    ],
    imports: [
        CommonModule,
        HttpClientModule,
        FormsModule,
        GameEditorRoutingModule,
        ReactiveFormsModule,
        SharedModule,
        MatDialogModule,
        MatSliderModule,
        ColorChromeModule,
    ],
    exports: []
})

export class GameEditorModule { }

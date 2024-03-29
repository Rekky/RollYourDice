import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatDialogModule} from '@angular/material/dialog';
import {GameEditorComponent} from './game-editor.component';
import {MapListToolsComponent} from './map-list-tools/map-list-tools.component';
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
import { FillColorComponent } from './context-menu/custom-inputs/fill-color/fill-color.component';
import { StrokeInputComponent } from './context-menu/custom-inputs/stroke-input/stroke-input.component';
import { ColorChromeModule } from 'ngx-color/chrome';
import {MatSliderModule} from '@angular/material/slider';
import { ColorCirclesPickerComponent } from './context-menu/custom-inputs/color-circles-picker/color-circles-picker.component';
import {DragulaModule} from 'ng2-dragula';
import { FitGridInputComponent } from './context-menu/custom-inputs/fit-grid-input/fit-grid-input.component';
import { KickedMessageComponent } from './kicked-message/kicked-message.component';
import {MatTooltipModule} from '@angular/material/tooltip';
import { BlockObjectEditionComponent } from './context-menu/custom-inputs/block-object-edition/block-object-edition.component';
import { DisplayJustForMasterComponent } from './context-menu/custom-inputs/display-just-for-master/display-just-for-master.component';
import { MoreOptionsComponent } from './context-menu/custom-inputs/more-options/more-options.component';
import { MapEditComponent } from './map-list-tools/map-edit/map-edit.component';
import { GameStatusToolsComponent } from './game-status-tools/game-status-tools.component';
import { MapZoomToolsComponent } from './map-zoom-tools/map-zoom-tools.component';
import { PropertiesListToolsComponent } from './properties-list-tools/properties-list-tools.component';
import { AssetsListComponent } from './assets-list/assets-list.component';
import { NumberInputComponent } from './context-menu/custom-inputs/number-input/number-input.component';
import { ObjectsListComponent } from './objects-list/objects-list.component';
import { CamerasListComponent } from './cameras-list/cameras-list.component';
import {BlueprintsModule} from '../../blueprints/blueprints.module';
import { LibraryListComponent } from './library-list/library-list.component';
import { KonvaImagePropertiesComponent } from './context-menu/konva-tools-properties/konva-image-properties/konva-image-properties.component';
import { KonvaActorPropertiesComponent } from './context-menu/konva-tools-properties/konva-actor-properties/konva-actor-properties.component';
import { ActorsListComponent } from './actors-list/actors-list.component';

@NgModule({
    declarations: [
        GameEditorComponent,
        MapComponent,
        MapListToolsComponent,
        MapPropertiesComponent,
        EditorToolsComponent,
        KonvaBrushPropertiesComponent,
        KonvaEraserPropertiesComponent,
        KonvaTextPropertiesComponent,
        KonvaRectanglePropertiesComponent,
        ToolsUxComponent,
        SelectedObjectEditorComponent,
        FillColorComponent,
        StrokeInputComponent,
        ColorCirclesPickerComponent,
        FitGridInputComponent,
        KickedMessageComponent,
        BlockObjectEditionComponent,
        DisplayJustForMasterComponent,
        MoreOptionsComponent,
        MapEditComponent,
        GameStatusToolsComponent,
        MapZoomToolsComponent,
        PropertiesListToolsComponent,
        AssetsListComponent,
        NumberInputComponent,
        ObjectsListComponent,
        CamerasListComponent,
        LibraryListComponent,
        KonvaImagePropertiesComponent,
        KonvaActorPropertiesComponent,
        ActorsListComponent
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
        DragulaModule,
        MatTooltipModule,
        BlueprintsModule,
    ],
    exports: []
})

export class GameEditorModule { }

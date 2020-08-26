import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { MapPropertiesComponent } from './game-editor/map-properties/map-properties.component';
import {ReactiveFormsModule} from '@angular/forms';
import { GameEditorComponent } from './game-editor/game-editor.component';
import { EditorToolsComponent } from './game-editor/editor-tools/editor-tools.component';
import { EditorLibrariesComponent } from './game-editor/editor-libraries/editor-libraries.component';
import { MapComponent } from './game-editor/map/map.component';
import {KonvaModule} from 'ng2-konva';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    MapPropertiesComponent,
    GameEditorComponent,
    EditorToolsComponent,
    EditorLibrariesComponent,
    MapComponent
  ],
    imports: [
        BrowserModule,
        KonvaModule,
        AppRoutingModule,
        ReactiveFormsModule
    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

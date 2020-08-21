import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { MapPropertiesComponent } from './game-editor/map-properties/map-properties.component';
import {ReactiveFormsModule} from '@angular/forms';
import { GameEditorComponent } from './game-editor/game-editor.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    MapPropertiesComponent,
    GameEditorComponent
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        ReactiveFormsModule
    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

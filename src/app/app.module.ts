import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { MapEditorComponent } from './map-editor/map-editor.component';
import { MapPropertiesComponent } from './map-editor/map-properties/map-properties.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    MapEditorComponent,
    MapPropertiesComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

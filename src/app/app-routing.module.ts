import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {MapEditorComponent} from './map-editor/map-editor.component';
import {HomeComponent} from './home/home.component';

const routes: Routes = [
  {
    path: 'map-editor',
    component: MapEditorComponent,
  },
  {
    path: 'home',
    component: HomeComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

import { Injectable } from '@angular/core';
import {ApiService} from './api.service';
import {Game} from '../classes/Game';

@Injectable({
  providedIn: 'root'
})
export class GameEditorService {

  constructor(private apiService: ApiService) { }

  getGameEditor() {
      // return this.apiService.getGameEditor('555');
  }
}

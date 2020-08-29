import { Injectable } from '@angular/core';
import {ApiService} from './api.service';
import {Game} from '../interfaces/test';

@Injectable({
  providedIn: 'root'
})
export class GameEditorService {

  constructor(private apiService: ApiService) { }

  getGameEditor(): Game {
      return this.apiService.getGameEditor();
  }
}

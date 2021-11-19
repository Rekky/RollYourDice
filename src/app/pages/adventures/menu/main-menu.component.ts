import {Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import {UserInteractor} from '../../../interactors/UserInteractor';

@Component({
    selector: 'app-menu',
    templateUrl: './main-menu.component.html',
    styleUrls: ['./main-menu.component.scss']
})
export class MainMenuComponent implements OnInit {

    constructor(
        private router: Router,
        private userInteractor: UserInteractor
    ) {
    }

    ngOnInit(): void {}

    goToMyAdventures(): void {
        this.router.navigate(['/game/my-adventures']);
    }

    logout(): void  {
        this.userInteractor.logout();
    }


    playZap(): void {
        const audio = new Audio();
        audio.src = '../../../assets/sounds/electric-zap.mp3';
        audio.volume = 0.05;
        audio.load();
        audio.play();
    }

    playButtonSound(): void {
        const audio = new Audio();
        audio.src = '../../../assets/sounds/mixkit-hard-typewriter-click-1119.wav';
        audio.volume = 0.05;
        audio.load();
        audio.play();
    }


}

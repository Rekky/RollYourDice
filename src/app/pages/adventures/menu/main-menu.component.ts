import {Component, OnDestroy, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { ParticlesConfig } from 'src/assets/particlesjs-config';
import {UserInteractor} from '../../../interactors/UserInteractor';
import {Coords} from "../../../classes/Coords";
declare let particlesJS: any;

@Component({
    selector: 'app-menu',
    templateUrl: './main-menu.component.html',
    styleUrls: ['./main-menu.component.scss']
})
export class MainMenuComponent implements OnInit, OnDestroy {

    mouseCoords: Coords = new Coords();
    bgX: number = 25;
    music: any;

    constructor(
        private router: Router,
        private userInteractor: UserInteractor
    ) {
        this.playMusic();
    }

    ngOnInit(): void {
        this.invokeParticles();
        this.followMouse();
    }

    ngOnDestroy(): void {
        if (this.music) {
            this.music.pause();
            this.music = null;
        }
    }

    public invokeParticles(): void {
        particlesJS('particles-js', ParticlesConfig, () => {});
        particlesJS('particles-js-2', ParticlesConfig, () => {});
        particlesJS('particles-js-3', ParticlesConfig, () => {});
    }

    goToMyAdventures(): void {
        this.router.navigate(['/game/my-adventures']);
    }

    logout(): void  {
        this.userInteractor.logout();
    }

    followMouse(): void {
        document.addEventListener('mousemove', ev => {
            const bg = document.getElementById('whaty');
            if (this.mouseCoords.x > ev.offsetX) {
                this.bgX = this.bgX - 0.02;
            } else if (this.mouseCoords.x < ev.offsetX) {
                this.bgX = this.bgX + 0.02;
            }
            bg.style.backgroundPositionX = this.bgX + '%';
            this.mouseCoords.x = ev.offsetX;
        });
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

    playMusic(): void {
        this.music = new Audio();
        this.music.src = '../../../assets/music/battle-of-the-dragons-8037.mp3';
        this.music.volume = 0.3;
        this.music.loop = true;
        this.music.load();
        this.music.play();
    }

}
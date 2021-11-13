import { Component, OnInit } from '@angular/core';
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
export class MainMenuComponent implements OnInit {

    repeatZap: boolean = true;
    mouseCoords: Coords = new Coords();
    bgX: number = 25;

    constructor(private router: Router, private userInteractor: UserInteractor) { }

    ngOnInit(): void {
        this.invokeParticles();
        this.playMusic();
        this.followMouse();
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

    mouseHover(): void {
        this.repeatZap = true;
        this.playZap();
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
        if (this.repeatZap) {
            const audio = new Audio();
            audio.src = '../../../assets/sounds/electric-zap.mp3';
            audio.volume = 0.05;
            audio.load();
            audio.play();
        }
    }

    playMusic(): void {
        const audio = new Audio();
        audio.src = '../../../assets/music/battle-of-the-dragons-8037.mp3';
        audio.volume = 0.3;
        audio.loop = true;
        audio.load();
        audio.play();
    }

}

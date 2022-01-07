import {Component, OnDestroy, OnInit} from '@angular/core';
import {Coords} from "../../classes/Coords";
import {ParticlesConfig} from "../../../assets/particlesjs-config";
declare let particlesJS: any;

@Component({
    selector: 'app-adventures',
    templateUrl: './launcher.component.html',
    styleUrls: ['./launcher.component.scss']
})
export class LauncherComponent implements OnInit, OnDestroy {

    mouseCoords: Coords = new Coords();
    bgX: number = 25;
    music: any;

    constructor() { }

    ngOnInit(): void {
        this.playMusic();
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

    followMouse(): void {
        // document.addEventListener('mousemove', ev => {
        //     const bg = document.getElementById('whaty');
        //     if (this.mouseCoords.x > ev.offsetX) {
        //         this.bgX = this.bgX - 0.01;
        //     } else if (this.mouseCoords.x < ev.offsetX) {
        //         this.bgX = this.bgX + 0.01;
        //     }
        //     bg.style.backgroundPositionX = this.bgX + '%';
        //     this.mouseCoords.x = ev.offsetX;
        // });
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

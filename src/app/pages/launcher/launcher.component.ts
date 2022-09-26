import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {ParticlesConfig} from '../../../assets/particlesjs-config';
declare let particlesJS: any;

@Component({
    selector: 'app-adventures',
    templateUrl: './launcher.component.html',
    styleUrls: ['./launcher.component.scss']
})
export class LauncherComponent implements OnInit, OnDestroy {

    music: any;
    isPlayingMusic: boolean = false;

    constructor() { }

    ngOnInit(): void {
        this.invokeParticles();
        this.playMusic();

        document.addEventListener('visibilitychange', event => {
            if (document.visibilityState === 'visible') {
                this.playMusic();
            } else {
                this.stopMusic();
            }
        });
    }

    ngOnDestroy(): void {
        if (this.music) {
            this.stopMusic();
            this.music = null;
        }
    }

    public invokeParticles(): void {
        particlesJS('particles-js', ParticlesConfig, () => {});
        particlesJS('particles-js-2', ParticlesConfig, () => {});
        particlesJS('particles-js-3', ParticlesConfig, () => {});
    }

    playMusic(): void {
        this.music = new Audio();
        this.music.src = '../../../assets/music/battle-of-the-dragons-8037.mp3';
        this.music.volume = 0.3;
        this.music.loop = true;
        this.music.autoplay = true;
        this.music.load();
        this.isPlayingMusic = true;
    }

    stopMusic(): void  {
        this.music.pause();
        this.music.currentTime = 0;
        this.isPlayingMusic = false;
    }

}

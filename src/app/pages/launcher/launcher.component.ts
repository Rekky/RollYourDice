import {Component, OnDestroy, OnInit} from '@angular/core';
import {ParticlesConfig} from '../../../assets/particlesjs-config';
import {StorageService} from '../../services/storage.service';
import {ActivatedRoute, Router, UrlSegment} from '@angular/router';
import {Subscription} from 'rxjs';
declare let particlesJS: any;

@Component({
    selector: 'app-adventures',
    templateUrl: './launcher.component.html',
    styleUrls: ['./launcher.component.scss']
})
export class LauncherComponent implements OnInit, OnDestroy {

    public music: any;
    private routerSub: Subscription;

    constructor(public storageService: StorageService, public activatedRouter: ActivatedRoute) { }

    ngOnInit(): void {
        this.invokeParticles();

        this.routerSub = this.activatedRouter.url.subscribe((url: UrlSegment[]) => {
            if (url[0].path === 'launcher') {
                const musicInterval = setInterval(() => {
                    if (this.storageService.settings$.value.music) {
                        this.playMusic();
                        clearInterval(musicInterval);
                    } else {
                        this.stopMusic();
                        clearInterval(musicInterval);
                    }
                }, 1000);
            }
        });
    }

    ngOnDestroy(): void {
        if (this.music) {
            this.stopMusic();
        }
        if (this.routerSub) {
            this.routerSub.unsubscribe();
        }
    }

    public invokeParticles(): void {
        particlesJS('particles-js', ParticlesConfig, () => {});
        particlesJS('particles-js-2', ParticlesConfig, () => {});
        particlesJS('particles-js-3', ParticlesConfig, () => {});
    }

    handleMusic(): void {
        if (!this.storageService.settings$.value.music) {
            this.playMusic();
            this.storageService.setSettings({music: true});
        } else {
            this.stopMusic();
            this.storageService.setSettings({music: false});
        }
    }

    playMusic(): void {
        if (!this.music) {
            this.music = new Audio();
            this.music.src = '../../../assets/music/battle-of-the-dragons-8037.mp3';
            this.music.volume = 0.2;
            this.music.loop = true;
            this.music.autoplay = true;
            this.music.load();
        }
    }

    stopMusic(): void  {
        this.music?.pause();
        this.music = null;
        // this.music.currentTime = 0;
    }

}

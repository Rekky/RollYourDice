import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ParticlesConfig } from 'src/assets/particlesjs-config';
import {UserInteractor} from '../../../interactors/UserInteractor';
declare let particlesJS: any;

@Component({
    selector: 'app-menu',
    templateUrl: './main-menu.component.html',
    styleUrls: ['./main-menu.component.scss']
})
export class MainMenuComponent implements OnInit {

    constructor(private router: Router, private userInteractor: UserInteractor) { }

    ngOnInit(): void {
        this.invokeParticles();
    }

    public invokeParticles(): void {
        particlesJS('particles-js', ParticlesConfig, () => {});
    }

    goToMyAdventures(): void {
        this.router.navigate(['/game/my-adventures']);
    }

    logout(): void  {
        this.userInteractor.logout();
    }

}

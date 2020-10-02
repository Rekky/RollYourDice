import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {User} from '../../classes/User';
import {UserInteractor} from '../../interactors/UserInteractor';
import {Subscription} from 'rxjs';
import {Router} from '@angular/router';

@Component({
    selector: 'app-sign',
    templateUrl: './sign.component.html',
    styleUrls: ['./sign.component.scss']
})
export class SignComponent implements OnInit, OnDestroy {

    getCurrentUserSub: Subscription;
    display: 'signIn' | 'signUp' | 'preloading' | 'loading' | 'loaded' = 'signIn';
    totalLoad: number = 0;
    percentage: number = 0;
    angle: number = 0;

    constructor(private userInteractor: UserInteractor,
                private router: Router) {
        this.getCurrentUserSub = this.userInteractor.getCurrentUserObs().subscribe((user: User) => {
            if (user !== null) {
                this.preloadState();
                setTimeout(() => {
                    this.display = 'loading';
                }, 600);
                const circle = document.getElementById('circle');
                setTimeout(() => {
                    const interval = setInterval(() => {
                        circle.setAttribute('stroke-dasharray', this.totalLoad + ', 20000');
                        if (this.angle >= 360) {
                            clearInterval(interval);
                            this.loadedState();
                        }
                        this.percentage = Math.round(this.angle / 360 * 100);
                        this.angle += 3;
                        this.totalLoad += 13;
                    }, 10);
                }, 600);
            } else {
                this.display = 'signIn';
            }
        });
    }

    ngOnInit(): void {
    }

    ngOnDestroy(): void {
        if (this.getCurrentUserSub) {
            this.getCurrentUserSub.unsubscribe();
        }
    }

    changeDisplay(display: any): void {
        this.display = display;
    }

    preloadState(): void {
        this.display = 'preloading';
        const logo = document.getElementsByClassName('sign-logo')[0] as HTMLDivElement;
        const leftBox = document.getElementsByClassName('left-box')[0] as HTMLDivElement;
        const rightBox = document.getElementsByClassName('right-box')[0] as HTMLDivElement;

        logo.style.transform = 'rotate(360deg)';
        logo.style.animation = 'rotateImage 500ms';
        leftBox.style.width = '100%';
        leftBox.style.animation = 'widthComplete 500ms';
        rightBox.style.right = '-2000px';
        rightBox.style.animation = 'hideRightBox 500ms';
    }

    loadedState(): void {
        const logo = document.getElementsByClassName('sign-logo')[0] as HTMLDivElement;
        const leftBox = document.getElementsByClassName('left-box')[0] as HTMLDivElement;

        setTimeout(() => {
            this.display = 'loaded';
            leftBox.style.width = '0';
            leftBox.style.left = '-2000px';
            logo.style.transform = 'rotate(-360deg)';
        }, 500);
        logo.style.animation = 'rotateImageLeft 1000ms 500ms';
        leftBox.style.animation = 'leftBoxLeaves 1000ms 500ms';

        setTimeout(() => {
            this.router.navigate(['./game-editor']);
        }, 4000);
    }
}

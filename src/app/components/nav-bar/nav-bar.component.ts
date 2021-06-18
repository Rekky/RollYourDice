import {Component, OnDestroy, OnInit} from '@angular/core';
import {UserInteractor} from '../../interactors/UserInteractor';
import {User} from '../../classes/User';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit, OnDestroy {

    user: User = null;
    userSubscription: Subscription;

  constructor(private userInteractor: UserInteractor, private router: Router) { }

  ngOnInit(): void {
      this.userSubscription = this.userInteractor.getUserObs().subscribe((user: User) => {
          this.user = user;
      });
  }

    logout(): void {
        this.userInteractor.logout();
        this.router.navigateByUrl('');
    }

    ngOnDestroy(): void {
        if (this.userSubscription) {
            this.userSubscription.unsubscribe();
        }
    }

}

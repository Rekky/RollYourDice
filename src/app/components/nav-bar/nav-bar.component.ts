import { Component, OnInit } from '@angular/core';
import {UserInteractor} from '../../interactors/UserInteractor';
import {User} from '../../classes/User';
import {Router} from '@angular/router';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit {

    user: User = null;

  constructor(private userInteractor: UserInteractor, private router: Router) { }

  ngOnInit(): void {
      this.user = this.userInteractor.getUser();
  }

    logout(): void {
        this.userInteractor.logout();
        this.router.navigateByUrl('');
    }

}

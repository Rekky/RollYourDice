import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-kicked-message',
  templateUrl: './kicked-message.component.html',
  styleUrls: ['./kicked-message.component.scss']
})
export class KickedMessageComponent implements OnInit {

  countDown: number = 10;

  constructor(private router: Router) { }

  ngOnInit(): void {
    const countDownInterval = setInterval(() => {
      this.countDown--;
      if(this.countDown <= 0) {
        clearInterval(countDownInterval);
        this.router.navigateByUrl('');
      }
    }, 1000)
  }

}

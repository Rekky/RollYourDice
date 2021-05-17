import {Component, Input, OnInit} from '@angular/core';


@Component({
  selector: 'post-card-vertical',
  templateUrl: './post-card-vertical.component.html',
  styleUrls: ['./post-card-vertical.component.scss']
})
export class PostCardVerticalComponent implements OnInit {

  @Input() post: any = null;
  postLink: string = '';

  constructor() { }

  ngOnInit(): void {

  }

}

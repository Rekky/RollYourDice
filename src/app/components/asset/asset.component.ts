import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'asset',
  templateUrl: './asset.component.html',
  styleUrls: ['./asset.component.scss']
})
export class AssetComponent implements OnInit {

  @Input() asset: any = null;
  @Input() src: string | null = null;
  @Input() alt: string | null = null;

  constructor() { }

  ngOnInit(): void {
  }

}

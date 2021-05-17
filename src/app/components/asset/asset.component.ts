import {Component, Input, OnInit} from '@angular/core';
import {PageAsset} from '../../classes/web/PageAsset';

@Component({
  selector: 'app-asset',
  templateUrl: './asset.component.html',
  styleUrls: ['./asset.component.scss']
})
export class AssetComponent implements OnInit {

  @Input() asset: PageAsset | null = null;
  @Input() src: string | null = null;
  @Input() alt: string | null = null;

  constructor() { }

  ngOnInit(): void {
  }

}

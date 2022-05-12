import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapZoomToolsComponent } from './map-zoom-tools.component';

describe('MapZoomToolsComponent', () => {
  let component: MapZoomToolsComponent;
  let fixture: ComponentFixture<MapZoomToolsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MapZoomToolsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MapZoomToolsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

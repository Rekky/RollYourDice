import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MapListToolsComponent } from './map-list-tools.component';

describe('MapListComponent', () => {
  let component: MapListToolsComponent;
  let fixture: ComponentFixture<MapListToolsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MapListToolsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapListToolsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

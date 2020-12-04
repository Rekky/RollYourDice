import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MapPropertiesComponent } from './map-properties.component';

describe('MapPropertiesComponent', () => {
  let component: MapPropertiesComponent;
  let fixture: ComponentFixture<MapPropertiesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MapPropertiesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapPropertiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

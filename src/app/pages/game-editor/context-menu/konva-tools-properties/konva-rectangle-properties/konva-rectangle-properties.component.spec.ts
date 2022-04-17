import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { KonvaRectanglePropertiesComponent } from './konva-rectangle-properties.component';

describe('KonvaRectanglePropertiesComponent', () => {
  let component: KonvaRectanglePropertiesComponent;
  let fixture: ComponentFixture<KonvaRectanglePropertiesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ KonvaRectanglePropertiesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KonvaRectanglePropertiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

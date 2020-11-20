import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KonvaRectanglePropertiesComponent } from './konva-rectangle-properties.component';

describe('KonvaRectanglePropertiesComponent', () => {
  let component: KonvaRectanglePropertiesComponent;
  let fixture: ComponentFixture<KonvaRectanglePropertiesComponent>;

  beforeEach(async(() => {
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

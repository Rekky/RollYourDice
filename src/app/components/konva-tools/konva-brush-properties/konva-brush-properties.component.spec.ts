import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { KonvaBrushPropertiesComponent } from './konva-brush-properties.component';

describe('KonvaBrushPropertiesComponent', () => {
  let component: KonvaBrushPropertiesComponent;
  let fixture: ComponentFixture<KonvaBrushPropertiesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ KonvaBrushPropertiesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KonvaBrushPropertiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

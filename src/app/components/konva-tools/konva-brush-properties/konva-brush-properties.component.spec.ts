import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KonvaBrushPropertiesComponent } from './konva-brush-properties.component';

describe('KonvaBrushPropertiesComponent', () => {
  let component: KonvaBrushPropertiesComponent;
  let fixture: ComponentFixture<KonvaBrushPropertiesComponent>;

  beforeEach(async(() => {
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

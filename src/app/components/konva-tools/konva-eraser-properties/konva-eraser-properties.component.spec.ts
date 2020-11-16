import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KonvaEraserPropertiesComponent } from './konva-eraser-properties.component';

describe('KonvaEraserPropertiesComponent', () => {
  let component: KonvaEraserPropertiesComponent;
  let fixture: ComponentFixture<KonvaEraserPropertiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KonvaEraserPropertiesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KonvaEraserPropertiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

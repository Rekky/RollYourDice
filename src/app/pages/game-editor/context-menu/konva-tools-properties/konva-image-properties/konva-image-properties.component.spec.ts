import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KonvaImagePropertiesComponent } from './konva-image-properties.component';

describe('KonvaImagePropertiesComponent', () => {
  let component: KonvaImagePropertiesComponent;
  let fixture: ComponentFixture<KonvaImagePropertiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KonvaImagePropertiesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KonvaImagePropertiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

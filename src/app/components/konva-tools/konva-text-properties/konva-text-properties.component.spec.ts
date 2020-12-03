import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { KonvaTextPropertiesComponent } from './konva-text-properties.component';

describe('KonvaTextPropertiesComponent', () => {
  let component: KonvaTextPropertiesComponent;
  let fixture: ComponentFixture<KonvaTextPropertiesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ KonvaTextPropertiesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KonvaTextPropertiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

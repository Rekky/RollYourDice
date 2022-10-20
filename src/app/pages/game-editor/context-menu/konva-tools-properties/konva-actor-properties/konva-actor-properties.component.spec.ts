import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KonvaActorPropertiesComponent } from './konva-actor-properties.component';

describe('KonvaActorPropertiesComponent', () => {
  let component: KonvaActorPropertiesComponent;
  let fixture: ComponentFixture<KonvaActorPropertiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KonvaActorPropertiesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KonvaActorPropertiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

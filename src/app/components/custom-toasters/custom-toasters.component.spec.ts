import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomToastersComponent } from './custom-toasters.component';

describe('CustomToastersComponent', () => {
  let component: CustomToastersComponent;
  let fixture: ComponentFixture<CustomToastersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomToastersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomToastersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

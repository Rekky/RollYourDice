import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BbEqualsComponent } from './bb-equals.component';

describe('BbEqualsComponent', () => {
  let component: BbEqualsComponent;
  let fixture: ComponentFixture<BbEqualsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BbEqualsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BbEqualsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BbGetComponent } from './bb-get.component';

describe('BbGetComponent', () => {
  let component: BbGetComponent;
  let fixture: ComponentFixture<BbGetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BbGetComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BbGetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

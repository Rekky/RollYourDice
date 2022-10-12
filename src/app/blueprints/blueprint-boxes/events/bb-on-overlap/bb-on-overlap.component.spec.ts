import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BbOnOverlapComponent } from './bb-on-overlap.component';

describe('BbOnOverlapComponent', () => {
  let component: BbOnOverlapComponent;
  let fixture: ComponentFixture<BbOnOverlapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BbOnOverlapComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BbOnOverlapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

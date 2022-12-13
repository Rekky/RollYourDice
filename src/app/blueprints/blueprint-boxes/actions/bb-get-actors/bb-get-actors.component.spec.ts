import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BbGetActorsComponent } from './bb-get-actors.component';

describe('BbGetActorsComponent', () => {
  let component: BbGetActorsComponent;
  let fixture: ComponentFixture<BbGetActorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BbGetActorsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BbGetActorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

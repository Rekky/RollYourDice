import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BbMoveActorToLocationComponent } from './bb-move-actor-to-location.component';

describe('BbMoveActorToLocationComponent', () => {
  let component: BbMoveActorToLocationComponent;
  let fixture: ComponentFixture<BbMoveActorToLocationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BbMoveActorToLocationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BbMoveActorToLocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

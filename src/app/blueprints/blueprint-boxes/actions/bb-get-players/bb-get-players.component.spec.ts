import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BbGetPlayersComponent } from './bb-get-players.component';

describe('BbGetPlayersComponent', () => {
  let component: BbGetPlayersComponent;
  let fixture: ComponentFixture<BbGetPlayersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BbGetPlayersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BbGetPlayersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

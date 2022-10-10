import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BbGetAllActorsComponent } from './bb-get-all-actors.component';

describe('BbGetAllActorsComponent', () => {
  let component: BbGetAllActorsComponent;
  let fixture: ComponentFixture<BbGetAllActorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BbGetAllActorsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BbGetAllActorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

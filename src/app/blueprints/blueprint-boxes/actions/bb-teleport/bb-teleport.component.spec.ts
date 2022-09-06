import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BbTeleportComponent } from './bb-teleport.component';

describe('BbTeleportComponent', () => {
  let component: BbTeleportComponent;
  let fixture: ComponentFixture<BbTeleportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BbTeleportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BbTeleportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

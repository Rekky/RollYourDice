import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KickedMessageComponent } from './kicked-message.component';

describe('KickedMessageComponent', () => {
  let component: KickedMessageComponent;
  let fixture: ComponentFixture<KickedMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KickedMessageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KickedMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

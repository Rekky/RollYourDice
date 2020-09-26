import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdventureNewComponent } from './adventure-new.component';

describe('AdventureNewComponent', () => {
  let component: AdventureNewComponent;
  let fixture: ComponentFixture<AdventureNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdventureNewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdventureNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

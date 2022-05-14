import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarCustomComponent } from './sidebar-custom.component';

describe('SidebarCustomComponent', () => {
  let component: SidebarCustomComponent;
  let fixture: ComponentFixture<SidebarCustomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SidebarCustomComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SidebarCustomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

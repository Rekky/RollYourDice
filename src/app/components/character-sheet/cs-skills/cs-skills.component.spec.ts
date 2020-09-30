import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CsSkillsComponent } from './cs-skills.component';

describe('CsSkillsComponent', () => {
  let component: CsSkillsComponent;
  let fixture: ComponentFixture<CsSkillsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CsSkillsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CsSkillsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

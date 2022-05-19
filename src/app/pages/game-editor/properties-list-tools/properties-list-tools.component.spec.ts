import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertiesListToolsComponent } from './properties-list-tools.component';

describe('PropertiesListToolsComponent', () => {
  let component: PropertiesListToolsComponent;
  let fixture: ComponentFixture<PropertiesListToolsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PropertiesListToolsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PropertiesListToolsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

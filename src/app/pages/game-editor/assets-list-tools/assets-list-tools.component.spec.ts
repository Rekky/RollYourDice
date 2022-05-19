import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetsListToolsComponent } from './assets-list-tools.component';

describe('AssetsListToolsComponent', () => {
  let component: AssetsListToolsComponent;
  let fixture: ComponentFixture<AssetsListToolsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssetsListToolsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetsListToolsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

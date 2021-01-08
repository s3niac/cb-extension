import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FastTipMenuComponent } from './fast-tip-menu.component';

describe('FastTipMenuComponent', () => {
  let component: FastTipMenuComponent;
  let fixture: ComponentFixture<FastTipMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FastTipMenuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FastTipMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

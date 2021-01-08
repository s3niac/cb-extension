import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FastTipComponent } from './fast-tip.component';

describe('FastTipComponent', () => {
  let component: FastTipComponent;
  let fixture: ComponentFixture<FastTipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FastTipComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FastTipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

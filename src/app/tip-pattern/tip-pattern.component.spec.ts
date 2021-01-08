import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TipPatternComponent } from './tip-pattern.component';

describe('TipPatternComponent', () => {
  let component: TipPatternComponent;
  let fixture: ComponentFixture<TipPatternComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TipPatternComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TipPatternComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

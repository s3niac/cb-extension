import { TestBed } from '@angular/core/testing';

import { TippingCookieInterceptor } from './tipping-cookie.interceptor';

describe('TippingCookieInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      TippingCookieInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: TippingCookieInterceptor = TestBed.inject(TippingCookieInterceptor);
    expect(interceptor).toBeTruthy();
  });
});

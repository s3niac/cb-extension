import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {CookieService} from 'ngx-cookie-service';

@Injectable()
export class TippingCookieInterceptor implements HttpInterceptor {

  constructor(private cookieService: CookieService) {
  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (request.url.includes('tipping/send_tip')) {
      const req = request.clone();
      const cookie = this.createCookie();
      req.headers.set('cookie', cookie);
      return next.handle(req);
    }
    return next.handle(request);
  }

  private createCookie(): string {
    const savedCookie = this.cookieService.getAll();
    const savedCookieKeyValues = Object.entries(savedCookie);
    return savedCookieKeyValues.filter((value: [string, string]) => value[0] !== '_gat' && value[0] !== 'cf_use_ob')
      .reduce((prev: string, cur: [string, string]) => {
        const cookieEntry = `${cur[0]}=${cur[1]}`;
        return prev && prev.length > 0 ? `${prev}; ${cookieEntry}` : cookieEntry;
      }, '');
  }
}

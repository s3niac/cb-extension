import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {CookieService} from 'ngx-cookie-service';
import {Observable} from 'rxjs';
import {CurrentTokens} from '../models';

const sendTokenTimeout = 50;

@Injectable({
  providedIn: 'root'
})
export class TipService {

  private tippingPath = 'tipping/send_tip';
  private currentTokenPath = 'tipping/current_tokens';
  private csrfTokenCookieKey = 'csrftoken';

  private currentToken: CurrentTokens = {
    token_balance: 0,
    tip_options: null,
  };

  constructor(private httpClient: HttpClient,
              private cookieService: CookieService) {
  }

  private get room(): string {
    let path = window.location.pathname;
    if (path.startsWith('/')) {
      path = path.substr(1);
    }
    if (path.endsWith('/')) {
      path = path.substr(0, path.length - 1);
    }
    return path;
  }

  sendTipPattern(pattern: number[], repeat: number): void {
    const requiredToken = this.sumPatternTips(pattern, repeat);
    this.getCurrentToken().subscribe((token: CurrentTokens) => {
      this.currentToken = token;
      if (requiredToken <= this.currentToken.token_balance) {
        for (let i = 0; i < repeat; i++) {
          this.doSendTipPattern(pattern);
        }
      }
      // TODO: show not enough token error message
    });
  }

  tipPattern(pattern: string, repeat = 1): void {
    const tips = this.splitPattern(pattern);
    this.sendTipPattern(tips, repeat);
  }

  tipPatternSum(pattern: string, repeat: number = 1): number {
    const tips = this.splitPattern(pattern);
    return this.sumPatternTips(tips, repeat);
  }

  getCurrentToken(): Observable<CurrentTokens> {
    const url = `${window.location.origin}/${this.currentTokenPath}/?room=${this.room}`;
    return this.httpClient.get<CurrentTokens>(url);
  }

  private sumPatternTips(pattern: number[], repeat: number): number {
    return pattern.reduce((prev: number, cur: number) => prev + cur, 0) * repeat;
  }

  private createSendTipFormData(tip: number, csrfToken: string): FormData {
    const formData = new FormData();
    formData.append('tip_amount', tip.toString(10));
    formData.append('message', '');
    formData.append('source', 'theater');
    formData.append('tip_room_type', 'public');
    formData.append('tip_type', 'public');
    formData.append('video_mode', 'split');
    formData.append('csrfmiddlewaretoken', csrfToken);
    return formData;
  }

  private sendTip(tip: number): Observable<any> {
    const url = `${window.location.origin}/${this.tippingPath}/${this.room}/`;
    const csrfToken = this.cookieService.get(this.csrfTokenCookieKey);
    const formData = this.createSendTipFormData(tip, csrfToken);
    const headers = new HttpHeaders({accept: '*/*', 'x-requested-with': 'XMLHttpRequest'});
    return this.httpClient.post(url, formData, {headers});
  }

  private doSendTip(pattern: number[], index: number): void {
    if (pattern.length > index) {
      this.sendTip(pattern[index]).subscribe(() => {
        setTimeout(() => {
          this.doSendTip(pattern, index + 1);
        }, sendTokenTimeout);
      });
    }
  }

  private doSendTipPattern(pattern: number[]): void {
    this.doSendTip(pattern, 0);
  }

  private splitPattern(pattern: string): number[] {
    return pattern.split(' ')
      .filter((tip: string) => !!tip && tip.length > 0)
      .map((tip: string) => +tip);
  }
}

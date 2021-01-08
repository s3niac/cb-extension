import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {CookieService} from 'ngx-cookie-service';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TipService {

  private tippingPath = 'tipping/send_tip';
  private currentTokenPath = 'tipping/current_tokens';
  private csrfTokenCookieKey = 'csrftoken';
  private started = 0;

  constructor(private httpClient: HttpClient,
              private cookieService: CookieService) {
  }

  get room(): string {
    let path = window.location.pathname;
    if (path.startsWith('/')) {
      path = path.substr(1);
    }
    if (path.endsWith('/')) {
      path = path.substr(0, path.length - 1);
    }
    return path;
  }

  getCurrentToken(): Observable<any> {
    const url = `${window.location.origin}/${this.currentTokenPath}/?room=${this.room}`;
    return this.httpClient.get(url);
  }

  sendSpeedTips(pattern: number[], repeat: number): void {
    this.started = Date.now();
    for (let i = 0; i < repeat; i++) {
      this.sendTipPattern(pattern, pattern.length * i);
    }
  }

  speedTips(pattern: string, repeat = 1): void {
    const tips = this.splitPattern(pattern);
    this.sendSpeedTips(tips, repeat);
  }

  overallTips(pattern: string, repeat: number = 1): number {
    return this.splitPattern(pattern).reduce((prev: number, cur: number) => prev + cur, 0) * repeat;
  }

  private createFormData(tip: number, csrfToken: string): FormData {
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

  private sendTip(tip: number): void {
    const url = `${window.location.origin}/${this.tippingPath}/${this.room}/`;
    const csrfToken = this.cookieService.get(this.csrfTokenCookieKey);
    const formData = this.createFormData(tip, csrfToken);
    const headers = new HttpHeaders({accept: '*/*', 'x-requested-with': 'XMLHttpRequest'});
    this.httpClient.post(url, formData, {headers}).subscribe(() => {
    }, error => console.error(error));
  }

  private sendSpeedTip(tip: number, counter: number): void {
    const timeout = 200 * counter;
    setTimeout(() => {
      this.sendTip(tip);
    }, timeout);
  }

  private sendTipPattern(pattern: number[], counter: number): void {
    pattern.forEach((tip: number, index: number) => this.sendSpeedTip(tip, counter + index));
  }

  private splitPattern(pattern: string): number[] {
    return pattern.split(' ')
      .filter((tip: string) => !!tip && tip.length > 0)
      .map((tip: string) => +tip);
  }
}

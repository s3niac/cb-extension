import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {CookieService} from 'ngx-cookie-service';
import {Observable} from 'rxjs';
import {CurrentTokens} from '../models';

const sendTokenDelay = 250;

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

  sendTipPattern(pattern: number[], repeat: number, bombs: number[]): void {
    const requiredToken = this.calculateRequiredTokens(pattern, repeat, bombs);
    this.getCurrentToken().subscribe((token: CurrentTokens) => {
      this.currentToken = token;
      if (requiredToken <= this.currentToken.token_balance) {
        const tipArray = this.createTipArray(pattern, repeat, bombs);
        this.doSendTipPattern(tipArray);
      }
      // TODO: show not enough token error message
    });
  }

  tipPattern(pattern: string, repeat = 1, bombs: string = ''): void {
    const tips = this.splitPattern(pattern);
    const bombTips = this.splitPattern(bombs);
    this.sendTipPattern(tips, repeat, bombTips);
  }

  tipPatternSum(pattern: string, repeat: number = 1, bombs: string = ''): number {
    const tips = this.splitPattern(pattern);
    const bombTips = this.splitPattern(bombs);
    return this.calculateRequiredTokens(tips, repeat, bombTips);
  }

  getCurrentToken(): Observable<CurrentTokens> {
    const url = `${window.location.origin}/${this.currentTokenPath}/?room=${this.room}`;
    return this.httpClient.get<CurrentTokens>(url);
  }

  private calculateRequiredTokens(tips: number[], repeat: number, bombTips: number[]): number {
    return this.sumTips(tips, repeat) + this.sumTips(bombTips, 1);
  }

  private sumTips(tips: number[], repeat: number): number {
    return tips.reduce((prev: number, cur: number) => prev + cur, 0) * repeat;
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

  private sendTip(tip: number): void {
    const url = `${window.location.origin}/${this.tippingPath}/${this.room}/`;
    const csrfToken = this.cookieService.get(this.csrfTokenCookieKey);
    const formData = this.createSendTipFormData(tip, csrfToken);
    const headers = new HttpHeaders({accept: '*/*', 'x-requested-with': 'XMLHttpRequest'});
    this.httpClient.post(url, formData, {headers}).subscribe(() => {
    }, error => console.error(error));
  }

  private doSendTip(tip: number, counter: number): void {
    const timeout = sendTokenDelay * counter;
    setTimeout(() => this.sendTip(tip), timeout);
  }

  private doSendTipPattern(pattern: number[]): void {
    pattern.forEach((tip: number, index: number) => this.doSendTip(tip, index));
  }

  private splitPattern(pattern: string): number[] {
    return pattern.split(' ')
      .filter((tip: string) => !!tip && tip.length > 0)
      .map((tip: string) => +tip);
  }

  private createTipArray(pattern: number[], repeat: number, bombs: number[]): number[] {
    const tips: number[] = [];
    for (let i = 0; i < repeat; i++) {
      tips.push(...pattern);
    }
    const tipsCount = tips.length;
    const tenPercentTipsCount = Math.floor(tipsCount / 10);
    const allowedBombIndexes = tipsCount - tenPercentTipsCount;
    bombs.forEach((value: number) => {
      const index = Math.floor( tenPercentTipsCount + (Math.random() * allowedBombIndexes));
      tips.splice(index, 0, value);
    });
    return tips;
  }
}

import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AppComponent} from './app.component';
import {FastTipComponent} from './fast-tip/fast-tip.component';
import {ReactiveFormsModule} from '@angular/forms';
import {TipPatternComponent} from './tip-pattern/tip-pattern.component';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {FastTipMenuComponent} from './fast-tip-menu/fast-tip-menu.component';
import {OverlayModule} from '@angular/cdk/overlay';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {CookieService} from 'ngx-cookie-service';
import {CommonModule} from '@angular/common';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {TippingCookieInterceptor} from './interceptors/tipping-cookie.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    FastTipComponent,
    TipPatternComponent,
    FastTipMenuComponent,
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    OverlayModule,
  ],
  providers: [
    CookieService,
    {
      provide: HTTP_INTERCEPTORS,
      multi: true,
      useClass: TippingCookieInterceptor,
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}

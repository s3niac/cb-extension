import {enableProdMode} from '@angular/core';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import {AppModule} from './app/app.module';
import {environment} from './environments/environment';

if (environment.production) {
  enableProdMode();
}

const divElement = document.createElement('DIV');
divElement.setAttribute('id', 'speed-tip');
divElement.setAttribute('style', 'height: 69px; width: 230px; box-sizing: border-box; font-size: 11px; overflow: hidden; display: inline-block; vertical-align: top; margin: 0px');
divElement.appendChild(document.createElement('app-root'));

function addFastTipPanel(): void {
  const videoPanel = document.querySelector('#VideoPanel');
  if (videoPanel) {
    videoPanel.appendChild(divElement);
    platformBrowserDynamic().bootstrapModule(AppModule)
      .catch(err => console.error(err));
    return;
  }
  setTimeout(() => addFastTipPanel(), 1000);
}

addFastTipPanel();

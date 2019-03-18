import { Injectable } from '@angular/core';

import { Subject } from 'rxjs';

import { User } from 'app/core/models';

@Injectable()
export class AppService {
  user = new User();
  onError$ = new Subject<any>();
  isBusy$ = new Subject<boolean>();

  get iconSet() {
    return {
      circleAccount: 'account-circle',
      done: 'check',
      error: 'alert-circle-outline',
      help: 'help-circle-outline',
      home: 'home',
      info: 'information-outline',
      logoff: 'power-standby',
      menu: 'menu',
      warning: 'alert'
    };
  }
}

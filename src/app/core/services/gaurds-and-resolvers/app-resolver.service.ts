import { Injectable } from '@angular/core';
import { Router, Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { Observable } from 'rxjs';

import { User } from 'app/core/models';
import { AppService } from 'app/core/services';
import { AuthUtilService } from 'app/core/services/auth';

import { environment } from 'environments/environment';

@Injectable()
export class AppResolver implements Resolve<User> {
  constructor(private router: Router, private authUtil: AuthUtilService, private appService: AppService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<User> {
    return new Observable<User>(observer => {
      if (!this.appService.user) {
        if (environment.production) {
          this.authUtil.createUser();
        } else {
          this.authUtil.createUser({ userId: 'P00117571' });
        }
      }
    });
  }
}

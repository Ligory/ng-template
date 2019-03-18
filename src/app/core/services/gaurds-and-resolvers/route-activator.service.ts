import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { of, Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { AuthUtilService } from 'app/core/services/auth';

@Injectable()
export class RouteActivator implements CanActivate, CanActivateChild {
  constructor(private authUtil: AuthUtilService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    if (this.authUtil.isLoggedIn) {
      return of(true);
    } else {
      return this.authUtil.login().pipe(
        map(userId => {
          if (userId) {
            this.authUtil.createUser({ userId: userId.toString() });
            return true;
          } else {
            return false;
          }
        }),
        catchError(error => {
          this.router.navigate(['service_not_available']);
          return of(false);
        })
      );
    }
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.authUtil.checkRouteAuthorization(route);
  }
}

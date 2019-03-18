import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { of, Observable, interval } from 'rxjs';
import { map } from 'rxjs/operators';

import { AppService } from 'app/core/services';
import { User, ScreenAccess } from 'app/core/models';

@Injectable()
export class AuthUtilService {
  readonly urlToGetLoggedInUser = '/authService/getLoggedInUser';
  readonly logoutURL = '/authService/logout.jsp?app=tms';
  loginRedirectUrl = '/authService/index.jsp?app=tms';

  isLoggedIn = false;

  constructor(private http: HttpClient, private router: Router, private appService: AppService) {
    interval(1000 * 60 * 15).subscribe(() => {
      this.login().subscribe(userId => {}, error => {});
    });
  }

  checkRouteAuthorization(route: ActivatedRouteSnapshot): boolean {
    const authorizationData = route.data;

    if (!authorizationData) {
      this.router.navigate(['/not_authorized', { screenName: '<Not defined in router config>' }]);
      return false;
    }

    const authFound = this.getScreenAuthorization(authorizationData.screenName);

    if (authFound) {
      if (this.isAuthorized(authFound.authorizations, authorizationData.requiredAccess)) {
        return true;
      } else {
        this.router.navigate(['/not_authorized', { screenName: authFound.screenName }]);
        return false;
      }
    } else {
      this.router.navigate(['/not_authorized', { screenName: authorizationData.screenName }]);
      return false;
    }
  }

  getScreenAuthorization(screenName: string) {
    return this.appService.user.screenAuthorizations.find(
      auth => auth.authorizations && auth.screenName.toUpperCase() === screenName.toUpperCase()
    );
  }

  isAuthorized(accesses: ScreenAccess, requiredAccess: ScreenAccess): boolean {
    if (!accesses) {
      return false;
    }
    return accesses.toUpperCase().indexOf(requiredAccess.toUpperCase()) >= 0 ? true : false;
  }

  checkAuthorization(feature: string, requiredAccess: ScreenAccess) {
    const authFound = this.getScreenAuthorization(feature);
    if (authFound) {
      return this.isAuthorized(authFound.authorizations, requiredAccess);
    } else {
      return false;
    }
  }

  createUser(init?: Partial<User>) {
    this.appService.user = new User(init);
  }

  login(): Observable<boolean | string> {
    return this.getLoggedInUser().pipe(
      map(loginData => {
        if (loginData.isLoggedIn) {
          this.isLoggedIn = loginData.isLoggedIn;
          return loginData.userName;
        } else {
          window.location.href = this.loginRedirectUrl;
          // this.router.navigate(['/login']);
        }
      })
    );
  }

  getLoggedInUser(): Observable<{ isLoggedIn: boolean; userName: string }> {
    return this.http.get<{ userName: string }>(this.urlToGetLoggedInUser).pipe(
      map(response => {
        if (response) {
          if ((response.userName || '').toUpperCase() === 'ERROR') {
            return { isLoggedIn: false, userName: '' };
          } else {
            return { isLoggedIn: true, userName: response.userName };
          }
        }
      })
    );
  }

  logout(): void {
    this.isLoggedIn = false;
    window.location.href = this.logoutURL;
  }
}

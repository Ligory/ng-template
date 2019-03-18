import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { AppService } from 'app/core/services';
import { routerTransition } from 'app/shared';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [routerTransition]
})
export class AppComponent {
  static previousRouteDepth = 0;

  isSideNavOpened = false;
  sideNavMode = 'side';

  constructor(public appService: AppService, private router: Router, private route: ActivatedRoute) {}

  showUserPreference() {}

  getState(outlet) {
    let returnValue;
    let currentDepth = 0;
    let isLastChild = true;
    let snapShot = this.route.snapshot;

    if (!snapShot.firstChild) {
      // 'data' defined in routing module
      return snapShot.data;
    }
    while (isLastChild) {
      currentDepth++;
      if (snapShot.firstChild) {
        snapShot = snapShot.firstChild;
      } else {
        returnValue = snapShot.data || snapShot.routeConfig.path;
        isLastChild = false;
      }
    }

    // if (AppComponent.previousRouteDepth > currentDepth) {
    //   returnValue = 'back';
    // } else {
    //   returnValue = 'front';
    // }
    AppComponent.previousRouteDepth = currentDepth;

    return returnValue;
  }

  logout() {}
}

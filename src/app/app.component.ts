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

  animationState = 0;
  isSideNavOpened = false;
  sideNavMode = 'side';

  constructor(
    public appService: AppService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  showUserPreference() {}

  onRouteActivate($event) {
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
        // 'routeLevel' to be defined in each router module
        currentDepth += snapShot.data['routeLevel'] || 0;
        isLastChild = false;
      }
    }

    if (currentDepth === AppComponent.previousRouteDepth) {
      throw new Error(
        'Route level is same. Configure appropriate route level in router module.'
      );
      // you can also increment by 1 to make it slide from Right to Left
      // currentDepth++;
    }

    AppComponent.previousRouteDepth = currentDepth;

    this.animationState = currentDepth;
  }

  logout() {}
}

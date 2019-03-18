import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { MomentModule } from 'ngx-moment';

import { AppService } from './services';
import { AuthUtilService } from './services/auth';
import { CanDeactivateGuard, AppResolver, RouteActivator } from './services/gaurds-and-resolvers';
import { AppHttpErrorHandlerService, AppHttpService } from './services/http';
import { DateTimeUtilService, AppMiddlewareUtilService, AppUtilService } from './services/utils';

@NgModule({
  imports: [CommonModule, HttpClientModule, RouterModule, MomentModule],
  providers: [
    AppService,
    AuthUtilService,
    AppResolver,
    CanDeactivateGuard,
    AppResolver,
    RouteActivator,
    AppHttpErrorHandlerService,
    AppHttpService,
    DateTimeUtilService,
    AppMiddlewareUtilService,
    AppUtilService
  ]
})
export class CoreModule {
  constructor(
    @Optional()
    @SkipSelf()
    parentModule: CoreModule
  ) {
    if (parentModule) {
      throw new Error('CoreModule is already loaded. Import only in AppModule');
    }
  }
}

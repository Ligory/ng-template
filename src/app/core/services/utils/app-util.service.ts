import { Injectable } from '@angular/core';

import { AppService } from 'app/core/services';
import { AlertType } from 'app/core/models';

@Injectable()
export class AppUtilService {
  constructor(private appService: AppService) {}
  getIconNameForType(messageType: AlertType) {
    switch (messageType) {
      case 'I':
        return this.appService.iconSet.info;
      case 'S':
        return this.appService.iconSet.done;
      case 'W':
        return this.appService.iconSet.warning;
      case 'E':
        return this.appService.iconSet.error;
      case 'Q':
        return this.appService.iconSet.help;
      default:
        return this.appService.iconSet.info;
    }
  }

  getIconColorClass(messageType: AlertType) {
    switch (messageType) {
      case 'I':
        return 'app-info-color';
      case 'S':
        return 'app-success-color';
      case 'W':
        return 'app-warning-color';
      case 'E':
        return 'app-error-color';
      case 'Q':
        return 'app-warning-color';
      default:
        return 'app-info-color';
    }
  }
}

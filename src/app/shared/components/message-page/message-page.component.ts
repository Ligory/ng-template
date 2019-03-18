import { Component, OnInit, Input, OnChanges, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';

import { ErrorObject } from 'app/core/models';
import { AppService } from 'app/core/services';

@Component({
  selector: 'app-message-page',
  templateUrl: './message-page.component.html',
  styleUrls: ['./message-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MessagePageComponent implements OnInit, OnChanges {
  colorClass: string;
  iconName: string;
  iconSizeClass: string;
  layout: 'row' | 'column';
  spinnerDiameter = 50;
  strokeWidth: number;
  subTitleFontSizeClass: string;
  titleFontSizeClass: string;

  @Input()
  size: 'sm' | 'md';

  @Input()
  title: string;

  @Input()
  errorObject: ErrorObject;

  @Input()
  isLoading: boolean;

  constructor(private appService: AppService) {}

  ngOnInit() {
    this.isLoading = this.isLoading || false;
    this.size = this.size || 'md';
    this.layout = this.layout || 'column';
    this.onSizeChange();
  }

  onSizeChange() {
    if (this.size === 'sm') {
      this.spinnerDiameter = 25;
      this.strokeWidth = 2.5;
      this.layout = 'row';
      this.iconSizeClass = 'app-icon-size-sm';
      this.titleFontSizeClass = 'app-title-font-sm';
      this.subTitleFontSizeClass = 'app-subtitle-font-sm';
    } else if (this.size === 'md') {
      this.spinnerDiameter = 50;
      this.strokeWidth = 5;
      this.layout = 'column';
      this.iconSizeClass = 'app-icon-size-md';
      this.titleFontSizeClass = 'app-title-font-md';
      this.subTitleFontSizeClass = 'app-subtitle-font-md';
    }
  }

  onErrorChange() {
    this.errorObject.type = this.errorObject.type || 'I';
    if (this.errorObject.type === 'S') {
      this.iconName = this.appService.iconSet.done;
      this.colorClass = 'app-primary-color';
    } else if (this.errorObject.type === 'I') {
      this.iconName = this.appService.iconSet.info;
      this.colorClass = 'app-accent-color';
    } else if (this.errorObject.type === 'W') {
      this.iconName = this.appService.iconSet.warning;
      this.colorClass = 'app-warning-color';
    } else if (this.errorObject.type === 'E') {
      this.iconName = this.appService.iconSet.error;
      this.colorClass = 'app-warn-color';
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['errorObject']) {
      if (this.errorObject && (this.errorObject instanceof ErrorObject || this.errorObject['errorTitle'])) {
        this.onErrorChange();
      }
    } else if (changes['size']) {
      this.onSizeChange();
    }
  }
}

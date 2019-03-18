import { Component, OnInit, Input, OnChanges, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';

import { MessageType, ErrorObject } from 'app/core/models';
import { AppUtilService } from 'app/core/services/utils';

@Component({
  selector: 'app-message-box',
  templateUrl: './message-box.component.html',
  styleUrls: ['./message-box.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MessageBoxComponent implements OnInit, OnChanges {
  @Input()
  errorObject: ErrorObject;

  @Input()
  messages: string[] = [];

  @Input()
  title = '';

  @Input()
  isLoading: boolean;

  messageTypeClass = 'app-message-box';
  iconName: string;
  type: MessageType;
  message: string;

  constructor(private appUtil: AppUtilService) {}

  ngOnInit() {
    this.isLoading = this.isLoading || false;
    this.type = this.type || 'I';
    this.updateMessageBox();
  }

  updateMessageBox() {
    if (this.isLoading) {
      if (this.title) {
        // append 'Fetching' string only if the title is not starting with a capital case.
        if (this.title[0] === this.title[0].toLowerCase()) {
          this.message = `Fetching ${this.title}...`;
        } else {
          this.message = this.title;
        }
      } else {
        this.message = `Fetching...`;
      }
    }

    if (this.type === 'I') {
      this.messageTypeClass = this.messageTypeClass + ' ' + 'app-message-box-info';
    } else if (this.type === 'S') {
      this.messageTypeClass = this.messageTypeClass + ' ' + 'app-message-box-success';
    } else if (this.type === 'E') {
      this.messageTypeClass = this.messageTypeClass + ' ' + 'app-message-box-error';
    } else if (this.type === 'W') {
      this.messageTypeClass = this.messageTypeClass + ' ' + 'app-message-box-warning';
    }
    this.iconName = this.appUtil.getIconNameForType(this.type);
    this.messageTypeClass = this.messageTypeClass + ' ' + this.appUtil.getIconColorClass(this.type);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['type']) {
      this.updateMessageBox();
    } else if (changes['message']) {
      this.updateMessageBox();
    } else if (changes['errorObject']) {
      if (this.errorObject && this.errorObject instanceof ErrorObject) {
        this.type = this.errorObject.type;
        this.message = this.errorObject.errorTitle;
        this.updateMessageBox();
      }
    }
  }
}

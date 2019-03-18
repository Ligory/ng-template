import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

import { throwError } from 'rxjs';

import { ErrorObject, MessageType, SAPAdditionalMessages } from 'app/core/models';

@Injectable()
export class AppHttpErrorHandlerService {
  constructor() {}

  handleGatewayError(error: HttpErrorResponse) {
    if (error instanceof ErrorObject) {
      return throwError(error);
    } else if (error instanceof Array && error[0] instanceof ErrorObject) {
      return throwError(error);
    }

    return throwError(this.catchError(error));
  }

  /**
   * Catch Http error and convert it to array of ErrorObject.
   * @param errorResponse error object from http call.
   */
  catchError(errorResponse: HttpErrorResponse | Error): ErrorObject[] {
    let errorObjects: ErrorObject[] = [];
    const errorObject = new ErrorObject({ type: 'E', errorTitle: 'An error occurred.' });

    try {
      if (errorResponse instanceof Error) {
        errorObject.errorTitle = errorResponse.message;
      } else if (errorResponse.error instanceof ErrorEvent) {
        errorObject.errorTitle = errorResponse.error.message;
      } else if (errorResponse.error.error) {
        errorObject.errorTitle = errorResponse.error.error.message.value;
        if (errorResponse.error.error.innererror) {
          if (errorResponse.error.error.innererror.errordetails) {
            for (const rfcError of errorResponse.error.error.innererror.errordetails) {
              if (this.isValidMessage(rfcError)) {
                errorObjects.push(
                  new ErrorObject({
                    type: rfcError.severity[0].toUpperCase() as MessageType,
                    errorTitle: this.handleLeadingZeros(rfcError.message)
                  })
                );
              }
            }
          }
        }
      } else if (errorResponse instanceof HttpErrorResponse) {
        errorObject.errorTitle = errorObject.errorTitle + `Status Code: ${errorResponse.status}, Status text: ${errorResponse.statusText}`;
      }
    } catch (error) {
      errorObject.errorTitle = 'Error occurred while parsing error response';
      errorObject.errorDescription = error;
    }

    if (errorObjects.length === 0) {
      errorObjects.push(errorObject);
    }

    errorObjects = this.removeDuplicateMessages(errorObjects);
    return errorObjects.filter(error => error.errorTitle);
  }

  transformSAPAdditionalMessages(sapMessage: SAPAdditionalMessages) {
    let messagesToReturn: ErrorObject[] = [];
    if (sapMessage) {
      if (this.isValidMessage(sapMessage)) {
        messagesToReturn.push(
          new ErrorObject({
            type: sapMessage.severity[0].toUpperCase() as MessageType,
            errorTitle: this.handleLeadingZeros(sapMessage.message)
          })
        );
      }
      if (sapMessage.details && sapMessage.details.length) {
        for (const detailMessage of sapMessage.details) {
          if (this.isValidMessage(detailMessage)) {
            messagesToReturn.push(
              new ErrorObject({
                type: detailMessage.severity[0].toUpperCase() as MessageType,
                errorTitle: this.handleLeadingZeros(detailMessage.message)
              })
            );
          }
        }
      }
    }
    messagesToReturn = this.removeDuplicateMessages(messagesToReturn);
    return messagesToReturn.filter(message => message.errorTitle);
  }

  isValidMessage(messageObject: any) {
    if (!messageObject.severity) {
      return false;
    } else if (!messageObject.message) {
      return false;
    } else {
      return true;
    }
  }

  handleLeadingZeros(message: string) {
    if (!message) {
      return;
    }
    return message.replace(/^0+/, '');
  }

  removeDuplicateMessages(messages: ErrorObject[]) {
    return messages.filter((value, index) => messages.findIndex(message => message.errorTitle === value.errorTitle) === index);
  }
}

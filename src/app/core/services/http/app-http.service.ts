import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { Plant, ErrorObject, SAPAdditionalMessages } from 'app/core/models';
import { AppMiddlewareUtilService, DateTimeUtilService } from 'app/core/services/utils';
import { AppHttpErrorHandlerService } from './app-http-error-handler.service';

@Injectable()
export class AppHttpService {
  constructor(
    private http: HttpClient,
    private dateTimeUtil: DateTimeUtilService,
    private appHttpErrorHandler: AppHttpErrorHandlerService,
    private middlewareUtil: AppMiddlewareUtilService
  ) {}

  get services() {
    return {
      getters: {
        plantCodeDescriptions: () => {
          return '';
        }
      }
    };
  }

  fetchPlantMetadata() {
    return this.fetchDataFromGateway<Plant[]>(this.services.getters.plantCodeDescriptions());
  }

  fetchDataFromGateway<ReturnType>(url: string, options?: { headers?: HttpHeaders }): Observable<ReturnType> {
    options = options || {};
    return this.http.get<any>(url, { headers: options.headers, responseType: 'json', observe: 'response' }).pipe(
      map(response => {
        const additionalMessags = response.headers.get('sap-message');
        let transformedMessages: ErrorObject[] = [];
        if (additionalMessags) {
          const additionalMessagsParsed = JSON.parse(additionalMessags) as SAPAdditionalMessages;
          transformedMessages = this.appHttpErrorHandler.transformSAPAdditionalMessages(additionalMessagsParsed);
          // we  don't care if there is any success message
          transformedMessages = transformedMessages.filter(messages => messages.type !== 'S');
          if (transformedMessages.length) {
            throw transformedMessages;
          }
        }
        return this.dateTimeUtil.recognizeODataDateTime(response.body);
      }),
      map(response => {
        return this.middlewareUtil.extractODataResponse(response);
      }),
      catchError(error => this.appHttpErrorHandler.handleGatewayError(error))
    );
  }

  postData(url: string, options: { body: any }): Observable<{ additionalMessage: ErrorObject[]; body: any }> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    headers = headers.append('X-Requested-With', 'XMLHttpRequest');

    return this.http.post(url, options.body, { headers: headers, observe: 'response' }).pipe(
      map(response => {
        const additionalMessags = response.headers.get('sap-message');
        let transformedMessages: ErrorObject[] = [];
        const responseBody = this.middlewareUtil.extractODataResponse(response.body);
        if (additionalMessags) {
          const additionalMessagsParsed = JSON.parse(additionalMessags) as SAPAdditionalMessages;
          transformedMessages = this.appHttpErrorHandler.transformSAPAdditionalMessages(additionalMessagsParsed);
        }
        return { additionalMessage: transformedMessages, body: responseBody };
      }),
      catchError(error => this.appHttpErrorHandler.handleGatewayError(error))
    );
  }

  updateData(url, options: { body: any; headers?: HttpHeaders }): Observable<ErrorObject[]> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    headers = headers.append('X-Requested-With', 'XMLHttpRequest');

    return this.http.put(url, options.body, { headers: headers, observe: 'response' }).pipe(
      map(response => {
        const additionalMessags = response.headers.get('sap-message');
        let transformedMessages: ErrorObject[];
        if (additionalMessags) {
          const additionalMessagsParsed = JSON.parse(additionalMessags) as SAPAdditionalMessages;
          transformedMessages = this.appHttpErrorHandler.transformSAPAdditionalMessages(additionalMessagsParsed);
        }

        return transformedMessages;
      }),
      catchError(error => this.appHttpErrorHandler.handleGatewayError(error))
    );
  }
}

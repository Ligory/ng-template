import { Injectable } from '@angular/core';

import { DateTimeUtilService } from './date-time-util.service';

@Injectable()
export class AppMiddlewareUtilService {
  constructor(private dateTimeUtil: DateTimeUtilService) {}

  constructODataKeyParams(keys: string[]) {
    let keysString = '';
    if (keys instanceof Array) {
      keysString = keys.join(`','`);
      keysString = `('${keysString}')`;
    }
    return keysString;
  }

  constructODataKeyValueParams(paramArray: Array<{ key: string; value: string | number | Date }>) {
    let params = '';
    for (const paramProp of paramArray) {
      params += params ? ',' : '(';
      params += paramProp.key + '=';
      params += this.constructODataParameter(paramProp);
    }
    return (params = params ? params + ')' : params);
  }

  constructODataFilterParams(filterArray: Array<{ key: string; value: string | number | Date }>) {
    let filter = '';
    for (const filterProp of filterArray) {
      filter += filter ? ' and ' : '?$filter=';
      filter += filterProp.key + ' eq ';
      filter += this.constructODataParameter(filterProp);
    }
    return filter;
  }

  private constructODataParameter(paramProp: { key: string; value: string | number | Date }) {
    let params = '';
    if (typeof paramProp.value === 'string') {
      params += `'${paramProp.value}'`;
    } else if (typeof paramProp.value === 'number') {
      params += paramProp.value;
    } else if (paramProp.value instanceof Date) {
      params += `datetime'${this.dateTimeUtil.formatDate(paramProp.value, 'OData')}'`;
    } else if (typeof paramProp.value === 'boolean') {
      params += paramProp.value;
    } else {
      params += `''`;
    }

    return params;
  }

  setExpandParams(params: string[]) {
    return '&$expand=' + params.join(',');
  }

  extractODataResponse(response) {
    if (response && response.d) {
      const entityTypeProperties = Object.getOwnPropertyNames(response.d);
      if (entityTypeProperties.length === 1 && entityTypeProperties[0] === 'results') {
        return response.d.results;
      } else {
        return response.d;
      }
    }

    return response;
  }

  removeMetadataInfo(objectToLookInto: any) {
    if (objectToLookInto instanceof Array) {
      for (const item of objectToLookInto) {
        this.removeMetadataInfo(item);
      }
    }

    for (const property in objectToLookInto) {
      if (objectToLookInto.hasOwnProperty(property)) {
        const propertyValue = objectToLookInto[property];
        if (propertyValue && typeof propertyValue === 'object') {
          delete propertyValue['__metadata'];
          delete propertyValue['__deferred'];
        } else if (propertyValue && propertyValue instanceof Array) {
          for (const item of propertyValue) {
            this.removeMetadataInfo(item);
          }
        }
      }
    }

    return objectToLookInto;
  }
}

import { Injectable } from '@angular/core';

import { DateFormatPipe, ParsePipe } from 'ngx-moment';

@Injectable()
export class DateTimeUtilService {
  filterGEToday(d: Date): boolean {
    return d.setHours(0, 0, 0, 0) <= new Date().setHours(0, 0, 0, 0);
  }

  filterLEToday(d: Date): boolean {
    return d.setHours(0, 0, 0, 0) >= new Date().setHours(0, 0, 0, 0);
  }

  /**
   * parse date string to JS Date object.
   * @param date date string to parse
   */
  parseDate(date: string | Date) {
    if (date) {
      return this.convertToJSDate(date);
    }

    return date;
  }

  /**
   * parse date and time string to JS Date object.
   * @param date date string to parse
   * @param time time string to parse
   */
  parseDateTime(date: string | Date, time: string): Date {
    if (date && time) {
      return new ParsePipe().transform(date + time, 'YYYYMMDDHHmmss').toDate();
    }
    throw new Error('date and/or time is emtpy');
  }

  /**
   * Formats the given date to the specified format type.
   * @param date The date object to format.
   * @param formatType The format type to convert to.
   */
  formatDate(date: string | Date, formatType: DateTimeFormatTypes, customPattern?: string) {
    if (formatType === 'Custom') {
      return new DateFormatPipe().transform(this.convertToJSDate(date), customPattern);
    }
    return new DateFormatPipe().transform(this.convertToJSDate(date), this.getDatePattern(formatType));
  }

  /**
   * Formats the given time string to the specified format type.
   * @param time The time object to format.
   * @param formatType The format type to convert to.
   */
  formatTime(time: string, formatType: DateTimeFormatTypes) {
    return this.extractODataTime(time);
  }

  /**
   *  Convert string date/time fields to JS date/time
   * @param objectToLookInto object to look for datetime fields
   */
  recognizeODataDateTime(objectToLookInto: any, dateTimeFormat: DateTimeFormatTypes = 'SAP') {
    for (const property in objectToLookInto) {
      if (objectToLookInto.hasOwnProperty(property)) {
        if (objectToLookInto[property] && typeof objectToLookInto[property] === 'object') {
          this.recognizeODataDateTime(objectToLookInto[property]);
        } else if (objectToLookInto[property] && objectToLookInto[property] instanceof Array) {
          for (const item of objectToLookInto[property]) {
            this.recognizeODataDateTime(item);
          }
        } else if (objectToLookInto[property] && typeof objectToLookInto[property] === 'string') {
          if (this.isThisODataDateString(objectToLookInto[property])) {
            objectToLookInto[property] = this.formatDate(objectToLookInto[property], dateTimeFormat);
          }
          if (this.isThisODataTimeString(objectToLookInto[property])) {
            objectToLookInto[property] = this.formatTime(objectToLookInto[property], dateTimeFormat);
          }
        }
      }
    }

    return objectToLookInto;
  }

  /**
   * Converts the given date string to Javascript Date object.
   * @param date The date string to convert to Date object.
   */
  private convertToJSDate(date: string | Date): Date {
    if (!date) {
      throw new Error('date value is null');
    }
    switch (this.findDateFormatType(date)) {
      case 'SAP':
        return new ParsePipe().transform(date.toString(), 'YYYYMMDD').toDate();
      case 'JS':
        return date as Date;
      case 'OData':
        return this.extractODataDate(date.toString());
    }
    throw new Error(`Not able to determine the date format of ${date}`);
  }

  private extractODataDate(dateString: string) {
    if (typeof dateString === 'string') {
      return new Date(+dateString.replace('/Date(', '').replace(')/', ''));
    }
    throw new Error(`date(${dateString}) is not in a recognizable format`);
  }

  private extractODataTime(timeString: string) {
    if (typeof timeString === 'string') {
      return timeString.replace(/\D+/g, '');
    }
    throw new Error(`time(${timeString}) is not in a recognizable format`);
  }

  private findDateFormatType(date: string | Date): DateTimeFormatTypes {
    if (date instanceof Date) {
      return 'JS';
    } else if (date.length === 8 && +date !== NaN && +date > 0) {
      return 'SAP';
    } else if (this.isThisODataDateString(date)) {
      return 'OData';
    } else {
      throw new Error('Not a valid date string: ' + date);
    }
  }

  private getDatePattern(formatType: DateTimeFormatTypes) {
    switch (formatType) {
      case 'SAP':
        return 'YYYYMMDD';
      case 'OData':
        return `YYYY-MM-DD[T00:00:00]`;
    }
    throw new Error(`Not a valid date format type(${formatType})`);
  }

  private isThisODataDateString(dateString: string) {
    if (typeof dateString === 'string') {
      return dateString.indexOf('/Date') >= 0;
    }
  }

  private isThisODataTimeString(dateString: string) {
    if (typeof dateString === 'string') {
      return (dateString.match(/\D+/g) || []).join('') === 'PTHMS';
    }
  }
}

type DateTimeFormatTypes = 'SAP' | 'JS' | 'OData' | 'Custom';

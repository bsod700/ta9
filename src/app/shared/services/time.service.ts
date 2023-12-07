import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TimeService {

  /**
   * Formats a Date object into a string in MM/DD/YYYY format.
   * @param date The Date object to be formatted.
   * @returns A string representing the formatted date.
 */
  formatDate(date: Date): string {
    let day = date.getDate().toString();
    let month = (date.getMonth() + 1).toString();
    const year = date.getFullYear();
  
    // Adding leading 0 for day and month if they are less than 10
    day = day.length < 2 ? '0' + day : day;
    month = month.length < 2 ? '0' + month : month;
  
    return `${month}/${day}/${year}`;
  }

  /**
   * Converts a date string in MM/DD/YYYY format to a Date object.
   * @param dateString The date string to be converted.
   * @returns The Date object representing the given date string.
 */
  stringToDate(dateString: string): Date {
    const parts = dateString.split("/");
    const year = parseInt(parts[2], 10);
    const month = parseInt(parts[0], 10) - 1;
    const day = parseInt(parts[1], 10);
    
    const dateObject = new Date(year, month, day);
    return dateObject;
  }
}

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TimeService {

  formatDate(date: Date): string {
    let day = date.getDate().toString();
    let month = (date.getMonth() + 1).toString(); // Months are 0-indexed
    const year = date.getFullYear();
  
    // Adding leading 0 for day and month if they are less than 10
    day = day.length < 2 ? '0' + day : day;
    month = month.length < 2 ? '0' + month : month;
  
    return `${month}/${day}/${year}`;
  }

  stringToDate(dateString: string): Date {
    const parts = dateString.split("/");
    const year = parseInt(parts[2], 10);
    const month = parseInt(parts[0], 10) - 1; // Month is 0-indexed in JavaScript
    const day = parseInt(parts[1], 10);
    
    const dateObject = new Date(year, month, day);
    return dateObject
  }
}

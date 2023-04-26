import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'monthsToNumber'
})
export class MonthsToNumberPipe implements PipeTransform {
  months:string[]=[
    'january',
    'february',
    'march',
    'april',
    'may',
    'june',
    'july',
    'august',
    'september',
    'october',
    'november',
    'december'
  ];

  transform(value:string): string {
    let monthNumber:string = '0';
    this.months.forEach((val,index)=>{
        if (val==value.toLowerCase()) {
          monthNumber=(index + 1).toString();
        }
    });
    return monthNumber;
  }

}

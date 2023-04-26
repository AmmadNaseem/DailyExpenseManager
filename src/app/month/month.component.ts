import { Component, Input, OnInit } from '@angular/core';
import { Month } from '../Models/models';
import { TableDataService } from '../services/table-data.service';

@Component({
  selector: 'app-month',
  templateUrl: './month.component.html',
  styleUrls: ['./month.component.scss']
})
export class MonthComponent implements OnInit {

  @Input() month!:Month;

  constructor(private tableService:TableDataService) {
    this.month={
      monthYear:'',
      monthNumber:'',
      tables:[],
      calculations:[],
      isSaved:false
    }
  }

  ngOnInit(): void {
    this.tableService.previousSavingsObservable.subscribe((res)=>{
      if(this.month.monthYear==res.monthYear && this.month.monthNumber==res.monthNumber){
        this.setCalculation('previous-savings',res.sum);
      }
    });
    

    this.tableService.currentSavingsRequestObservable.subscribe((res)=>{
      if(this.month.monthYear==res.monthYear && this.month.monthNumber==res.monthNumber){
        this.currentSavingsUpdated();
      }
    });

    //===THIS WILL SEND THE REQUEST, TO GET THE CURRENT SAVINGS VALUE OF PREVIOUS MONTH
    let prevMonthDate = this.getPreviousDate(this.month.monthYear,this.month.monthNumber);
    this.tableService.currentSavingsRequestObservable.next({
      monthYear:prevMonthDate.monthYear,
      monthNumber:prevMonthDate.monthNumber,
    });

  }

  sumUpdatedInCalc(tableName:string,sum:number){
    if (tableName=='earnings') {
      this.setCalculation('current-earnings',sum.toString());
    } else {
      this.setCalculation('current-expenditure',sum.toString());
    }
  }
// ==========FOR CALCULATIONS=========
  setCalculation(name:string,sum:string){
    this.month.calculations.forEach((item,index)=>{
      if(item.name==name){
        item.value=sum;
      }
    });
    this.setCurrentSavings();
  }

  getCalculation(name:string):number{
    let sum='0';
    this.month.calculations.forEach((item,index)=>{
      if(item.name==name){
        sum = item.value;
      }
    });
    return parseInt(sum);
  }

  setCurrentSavings(){
    let previousSaving=this.getCalculation('previous-savings');
    let currentEarnings=this.getCalculation('current-earnings');
    let currentExpenditure=this.getCalculation('current-expenditure');

    let currentSaving=previousSaving + currentEarnings - currentExpenditure;

    this.month.calculations.forEach((item,index)=>{
       if(item.name=='current-savings'){
        item.value=currentSaving.toString();
       }
    });
    this.currentSavingsUpdated();
  }

  //THIS WILL SEND THE VALUE OF CURRENT SAVINGS INTO PREVIOUS SAVINGS OBSERVABLE
  // SO THAT NEXT MONTH CAN TAKE IT AS ITS PREVIOUS SAVINGS.
  currentSavingsUpdated(){
    let nextDate=this.getNextDate(this.month.monthYear,this.month.monthNumber);
    this.tableService.previousSavingsObservable.next({
      monthYear:nextDate.monthYear,
      monthNumber:nextDate.monthNumber,
      sum:this.getCalculation('current-savings').toString()
    });
 
      
  }

  getPreviousDate(monthYear:string,monthNumber:string):{monthYear:string; monthNumber:string}{
    let temp=parseInt(monthNumber);
    let prevMonth=temp==1 ? '12':(temp - 1).toString();

    let prevYear=prevMonth=='12' ? (parseInt(monthYear) - 1).toString() :monthYear;

    return {monthYear:prevYear, monthNumber:prevMonth};
  }

  getNextDate(monthYear:string,monthNumber:string):{monthYear:string; monthNumber:string}{
    let temp=parseInt(monthNumber);
    let nextMonth=temp==12 ? '1':(temp + 1).toString();

    let nextYear=nextMonth=='1' ? (parseInt(monthYear) + 1).toString() :monthYear;

    return {monthYear:nextYear, monthNumber:nextMonth};
  }

}

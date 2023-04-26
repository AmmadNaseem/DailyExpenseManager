import { TableDataService } from './../services/table-data.service';
import { MonthsToNumberPipe } from './../Pipes/months-to-number.pipe';
import { Month, Table, MonthNavigation, MonthCalculation } from './../Models/models';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-months',
  templateUrl: './months.component.html',
  styleUrls: ['./months.component.scss']
})
export class MonthsComponent implements OnInit {

  months:Month[]=[];
  monthsToDisplay:Month[]=[];
  monthsNavigationList:MonthNavigation[]=[];

  constructor(private tableService:TableDataService) { }

  ngOnInit(): void {
    this.tableService.getMonthList().subscribe((res:any)=>{
      for(let item of res){
        this.addMonthByNumber(item.monthYear,item.monthNumber);
      }
      console.log(this.monthsNavigationList);

      this.monthsToDisplay=this.months;
    });

    // =====WILL EXECUTE WHENEVER A NAVIGATION IS SELECTED FROM SID-NAV
    this.tableService.monthNavigationSelectedObservable.subscribe((res)=>{
      this.monthsToDisplay=this.filterMonths(res.monthYear,res.monthNumber);
    });

    // =======FOR TESTING THE FUNCTIONS======
    // this.addMonthByName('2022','february');
    // this.addMonthByNumber('2022','3');
    // this.addNextMonth();
    // console.log(this.months);

  }

  addNextMonth(){
    let nextYear:string='';
    let nextMonth:string='';
    if (this.months[0].monthNumber=='12') {
      nextMonth='1';
      nextYear=(parseInt(this.months[0].monthYear)+1).toString();
    } else {
      nextMonth=(parseInt(this.months[0].monthNumber)+1).toString();
      nextYear= this.months[0].monthYear;
    }
    return this.addMonthByNumber(nextYear,nextMonth);
  }

  addMonthByName(monthYear:string,monthName:string):any{
    let monthNumber=new MonthsToNumberPipe().transform(monthName);
    return this.addMonthByNumber(monthYear,monthNumber);
  }

  addMonthByNumber(monthYear:string,monthNumber:string){
    if (monthNumber!='0') {

      let earningsTable:Table={
        tableName:'earnings',
        columns:['date','name','amount'],
        rows:[],
        isSaved:false
      };

      let expTable:Table={
        tableName:'expenditure',
        columns:['date','name','amount'],
        rows:[],
        isSaved:false
      };

      let calcs:MonthCalculation[]=[
        {
          name:'current-savings',
          value:'0',
          isSaved:false
        },
        {
          name:'current-expenditure',
          value:'0',
          isSaved:false
        },
        {
          name:'current-earnings',
          value:'0',
          isSaved:false
        },
        {
          name:'previous-savings',
          value:'0',
          isSaved:false
        },
      ];

      let month:Month={
        monthNumber:monthNumber,
        monthYear:monthYear,
        tables:[earningsTable,expTable],
        calculations:calcs,
        isSaved:false
      };
      this.months.unshift(month);
      this.addMonthNavigation(monthYear,monthNumber);
      return true;
    }
    return false;
  }

  addMonthNavigation(monthYear:string,monthNumber:string){
    if (this.monthsNavigationList.length==0) {
      let firstMonthNavigation:MonthNavigation={
        monthNumber:'all',
        monthYear:'all'
      };
      this.monthsNavigationList.unshift(firstMonthNavigation);
    }
    let monthNavigation:MonthNavigation={
      monthNumber:monthNumber,
      monthYear:monthYear
    }
    this.monthsNavigationList.splice(1,0,monthNavigation); //THIS WILL ADD DATA IN LIST 2ND NUMBER
    this.tableService.monthNavigationObservable.next(this.monthsNavigationList);
  }

  deleteMonth(monthYear:string,monthName:string){
    if (monthYear!='' && monthName!='') {
      let monthNumber=new MonthsToNumberPipe().transform(monthName);
      let response=confirm('Are you Sure?')
      if(response){
        this.months.forEach((month,index)=>{
          if(month.monthNumber==monthNumber && month.monthYear==monthYear){
            this.months.splice(index,1);
            this.removeMonthNavigation(monthYear,monthNumber);
          }
        });
      }
    } else {
      alert('For deleting, all fields are required to fill.')
    }

  }

  removeMonthNavigation(monthYear:string,monthNumber:string){
    this.monthsNavigationList.forEach((value,index)=>{
      if(value.monthNumber===monthNumber && value.monthYear===monthYear){
        this.monthsNavigationList.splice(index,1);
      }
    });
    this.tableService.monthNavigationObservable.next(this.monthsNavigationList);
  }

  filterMonths(monthYear:string,monthNumber:string){
    let filteredData:Month[]=[];
    if (monthYear==='all') {
      if (monthNumber==='all') {
        filteredData=this.months;
      } else {
        //
      }
    } else {
      if (monthNumber==='all') {
        //
      } else {
        for(let month of this.months){
          if(month.monthYear===monthYear && month.monthNumber===monthNumber){
            filteredData.push(month);
          }
        }
      }
    }
    return filteredData;
  }

}

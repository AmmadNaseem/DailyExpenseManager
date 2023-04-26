import { TableDataService } from '../services/table-data.service';
import { MonthNavigation } from './../Models/models';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.scss']
})
export class SideBarComponent implements OnInit {

  navigationList!:MonthNavigation[];

  constructor(private tableService:TableDataService) {
    this.navigationList=[];
   }

  ngOnInit(): void {
    this.tableService.monthNavigationObservable.subscribe((res)=>{
      this.navigationList=res;
    });
  }

  newMonthNavigationClicked(event:any){
    let monthNavigation:MonthNavigation={
      monthYear:event.monthYear,
      monthNumber:event.monthNumber
    };
    this.tableService.monthNavigationSelectedObservable.next(monthNavigation);
  }

}

import { MonthNavigation } from './../Models/models';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TableDataService {
   BASE_URL:String='https://localhost:7264/api/';

   monthNavigationObservable=new Subject<MonthNavigation[]>(); //THIS IS WILL SEND THE LIST OF MONTH NAVIGATION WHOM SUBSCRIBE IT:THIS UPDATE ARRAY
   monthNavigationSelectedObservable=new Subject<MonthNavigation>();//THIS WILL UPDATE ONE MONTH NAVIGATION NOT AN ARRAY.

   previousSavingsObservable = new Subject<{
    monthYear:string;
    monthNumber:string;
    sum:string;
   }>();


   currentSavingsRequestObservable=new Subject<{
    monthYear:string;
    monthNumber:string;
   }>();

  constructor(private http:HttpClient) { }

  getMonthList():any{
    return this.http.get(this.BASE_URL+'GetListOfMonths');
  }

  getTableRows(monthYear:string,monthNumber:string,tableName:string){
    let parameters=new HttpParams();
    parameters=parameters.append('monthYear',monthYear);
    parameters=parameters.append('monthNumber',monthNumber);
    parameters=parameters.append('tableName',tableName);

    return this.http.get<any>(this.BASE_URL+'GetTableData',{params:parameters});
  }

  postTableRow(monthDataForBackend:any){
    return this.http.post(this.BASE_URL+'InsertTableRow',monthDataForBackend,{responseType:'text'});
  }

  deleteTableRow(rowId:number){
    return this.http.delete(this.BASE_URL+'DeleteTableRow/'+rowId,{responseType:'text'});
  }
}

import { AbstractControl, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Table, TableRow } from './../Models/models';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TableDataService } from '../services/table-data.service';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {

  @Input()tableData!:Table;
  @Input() monthNumber!:string;
  @Input() monthYear!:string;
  @Output() sumUpdated=new EventEmitter<number>();

  addRowForm:FormGroup;

  constructor(private tableService:TableDataService) {
    // ======HERE WE INITIALIZE THE VALUES
    this.tableData={
      tableName:'',
      columns:[],
      rows:[],
      isSaved:false
    };

    this.addRowForm=new FormGroup({});

    this.monthNumber='';
    this.monthYear='';

   }

  ngOnInit(): void {
  //=====GETTING ALL THE ROWS OF THIS TABLE WHEN THIS TABLE IS INITIALIZED.
  this.tableService
  .getTableRows(this.monthYear,this.monthNumber,this.tableData.tableName)
  .subscribe((res)=>{
    this.tableData.rows=[];
    for(let row of res){
      this.addRowToArray(row.id,row.date,row.name,row.amount,true);
    }
  });


  //=====FORM INITIALIZATION======
    this.addRowForm=new FormGroup({
      date:new FormControl('',[
        Validators.required,
        Validators.pattern('[0-9]*'),
        daysInMonthValidator(this.monthYear,this.monthNumber)
      ]),
      name:new FormControl('',[Validators.required]),
      amount:new FormControl('',[
        Validators.required,
        Validators.pattern('[0-9]*')
      ])
    });

    // ======THIS IS FOR TESTING THE ADDROWTOARRAY
    // this.addRowToArray(2,'22','recharge','200',false);
  }

  addNewRow(){
    let date=this.dateControl.value;
    let name=this.nameControl.value;
    let amount=this.amountControl.value;

    let monthDataForBackend={
      monthYear:this.monthYear,
      monthNumber:this.monthNumber,
      tableName:this.tableData.tableName,
      date:date,
      name:name,
      amount:amount
    };

    this.tableService.postTableRow(monthDataForBackend).subscribe((res)=>{
      this.addRowToArray(parseInt(res),date,name,amount,true);
    })

  }

  addRowToArray(id:number,date:string,name:string,
    amount:string,isSaved:boolean){
      let row:TableRow={
        id:id,
        date:date,
        name:name,
        amount:amount,
        isSaved:isSaved
      };
      this.tableData.rows.push(row);
      this.updateTheSum();
      this.clearForm();
  }

  editRow(rowId:number | undefined){
    if (this.dateControl.value=='' && this.nameControl.value=='' && this.amountControl.value=='') {
      this.tableData.rows.forEach((row,index)=>{
        if(rowId && row.id==rowId){
          this.dateControl.setValue(row.date);
          this.nameControl.setValue(row.name);
          this.amountControl.setValue(row.amount);
          this.deleteRow(row.id);
        }
      });

    } else {
      alert('First Add pending Row Data,Thanks!')
    }
  }

  deleteRow(id:number | undefined){
    this.tableData.rows.forEach((row,index)=>{
      if(id && row.id==id){
        this.tableService.deleteTableRow(row.id).subscribe((res)=>{
          this.tableData.rows.splice(index,1);
        });
      }
    });
  }


  clearForm(){
    this.dateControl.setValue('');
    this.nameControl.setValue('');
    this.amountControl.setValue('');
  }


  updateTheSum(){
    let sum=0;
    this.tableData.rows.forEach((row,index)=>{
      sum+=parseInt(row.amount);
    });
    this.sumUpdated.emit(sum);
  }



  //===GETTERS TO ACCESS FORM ELEMENTS AND FORM ITSELF
  public get dateControl():FormControl{
    return this.addRowForm.controls['date'] as FormControl;
  }

  public get nameControl():FormControl{
    return this.addRowForm.controls['name'] as FormControl;
  }

  public get amountControl():FormControl{
    return this.addRowForm.controls['amount'] as FormControl;
  }

  public get RowForm(){
    return this.addRowForm as FormGroup;
  }

}

// ====VALIDATOR FUNCTION TO CHECK NUMBER OF DAYS IN GIVEN MONTH
function daysInMonthValidator(monthYear:string,monthNumber:string):ValidatorFn {
  return (control:AbstractControl):{ [key:string]:boolean}| null =>{
    if (parseInt(control.value)<1 ||
     parseInt(control.value) > getDaysInMonth(monthYear,monthNumber))
    {
      return {daysInvalid:true};
    }
    return null;
  };

}

function getDaysInMonth(monthYear:string,monthNumber:string):number{
  //THIS WILL RETURN LAST DAY OF THIS MONTH OF YEAR;
  // Date(parseInt(monthYear),parseInt(monthNumber),0); 0 MEAN RETURN LAST DAY.
  return new Date(parseInt(monthYear),parseInt(monthNumber),0).getDate();
}


import { Component, OnInit, ViewChild } from '@angular/core';
import { CsvElement } from './models/csv.model';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from './services/toastr.services';


const ELEMENT_DATA: CsvElement[] = [
  {firstName: 'Theo', surName: 'Jansen', issueCount: 5, dob: new Date('1978-01-02T00:00:00')},
  {firstName: 'Fiona', surName: 'de Vries', issueCount: 7, dob: new Date('1950-11-12T00:00:00')},
  {firstName: 'Petra', surName: 'Boersma', issueCount: 1, dob: new Date('2001-04-20T00:00:00')}
];

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  @ViewChild('fileImportInput') fileImportInput: any;

  public csvRecords: any[];
  private filterValue: string;
  public title = 'Rabo Bank!';
  private _columns: string[] = ['firstName', 'surName', 'issueCount', 'dob'];
  private _dataSource;

  constructor(private _toastrService: ToastrService) {

  }

  ngOnInit() {
    this.filterValue = '';
    this.csvRecords = [];
    this._dataSource = '';

  }

  /**
   * TO CHECK IF THE UPLOADED FILE IS CSV OR NOT
   */
  isCsvFile(file: any): boolean {
    return file.name.endsWith('.csv');
  }

  /**
   * GET CSV FILE HEADER COLUMNS
  */
  getCSVFileHeaderData(csvRecordsArr: any) {
    const headers = csvRecordsArr[0].split(',');
    const headerArray = [];
    for (let j = 0; j < headers.length; j++) {
      headerArray.push(headers[j]);
    }
    return headerArray;
  }

 /**
  * RESETTING THE STATE OF CSVRECORD ARRAY
  */
  fileReset() {
    this.fileImportInput.nativeElement.value = '';
    this.csvRecords = [];
  }

/**
 * @param csvRecordsArray -> THE PARSED CSV FILE
 * @param headerLength -> THE LENGTH OF THE HEADER COLUMN
 */
  getCSVFileRecords(csvRecordsArray: any, headerLength: number) {
    const dataArr = [];

    for (let i = 1; i < csvRecordsArray.length; i++) {
      const data = csvRecordsArray[i].split(',');

      // IF THE LENGTH OF EACH ROW IS EQUAL TO HEADER COLUMN, THEN ONLY PROCESS THAT DATA
      if (data.length === headerLength) {

        const csvRecord: CsvElement = new CsvElement();
        const tempDt = data[3].replace(/"/g, '');
        console.log(tempDt);
        console.log(new Date(tempDt));

        csvRecord.firstName = data[0].trim().replace(/"/g, '');
        csvRecord.surName = data[1].trim().replace(/"/g, '');
        csvRecord.issueCount = data[2].trim().replace(/"/g, '');
        csvRecord.dob = new Date(data[3].trim().replace(/"/g, ''));

        dataArr.push(csvRecord);
      }
    }
    return dataArr;
  }

/**
 *
 * @param $event -> CAPTURED EVENT WHILE LISTENING TO THE FILE CHANGE ON THE TEMPLATE
 */
  fileChangeListener($event: any): void {
    console.log('File change', $event);
    const text = [];
    const files = $event.srcElement.files;

    if (this.isCsvFile(files[0])) {

      const input = $event.target;
      const reader = new FileReader();
      reader.readAsText(input.files[0]);

      reader.onload = (data) => {
        const csvData = reader.result.toString();
        const csvRecordsArray = csvData.split(/\r\n|\n/);

        this.csvRecords = this.getCSVFileRecords(csvRecordsArray, this._columns.length);
        this._dataSource = new MatTableDataSource(this.csvRecords);
      };

      reader.onerror = function() {
        alert('Unable to read ' + input.files[0]);
      };

    } else {
      const errMsg = 'Please import a valid .csv file!';
      this._toastrService.error(errMsg);
      this.fileReset();
    }

  }
}

import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { jsPDF } from "jspdf";

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit {

  @Output() removeWaypoint = new EventEmitter()
  @Output() getTableObject = new EventEmitter();

  tableForm: FormGroup;
  loaded = true;
  planSent = false;
  @ViewChild('tableHTML', {static: false}) tableHTML: ElementRef;

  constructor(
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.tableForm = this.fb.group({
      table: this.fb.array([]),
    });

    this.tableForm.valueChanges.subscribe(() => {
      this.updateAndSendData();
    });   
  }

  updateAndSendData() {
    let waypointBody = [];
    this.table.value.forEach(element => {
      waypointBody.push({
        name: element.wyp,
        freq: element.freq,
        alt: element.alt,
        windDirection: 150,
        windSpeed: 10,
        latitude: element.latitude,
        longitude: element.longitude,
        tas: 0
      })
    });
    
    if(waypointBody.length !== 0) {
      this.getTableObject.emit({
        tableForm: waypointBody,
        ready: this.table.valid
      });
    } else {
      this.getTableObject.emit({
        tableForm: waypointBody,
        ready: false
      });
    }
  }
  
  removeWaypointFromTable(data: any, index: number) {
    this.removeWaypoint.emit(data.controls.id.value);
    this.table.removeAt(index);
    this.updateAndSendData();
  }

  addTable(tableId, lat, lng, wypName = "") {
    const row = this.fb.group({
        id: [tableId],
        wyp: [wypName, [ Validators.required ]],
        freq: [Number],
        alt: [, [ Validators.required ]],
        wind: [''],
        tt: [Number],
        wca: [Number],
        th: [Number],
        var: [Number],
        mh: [Number],
        tas: [Number],
        gs: [Number],
        dist: [Number],
        time: [Number],
        timeAcc: [Number],
        eto: [Number],
        ff: [Number],
        pwrset: [Number],
        latitude: [lat],
        longitude: [lng]
    })

    // row.setValue({latitude: this.lat, longitude: this.lng})
    this.table.push(row);
  }

  setRequestedTable(data) {
    console.log(data)
    let row;
    this.table.clear();
    data.forEach(element => {
      row = this.fb.group({
        wyp: [element.name],
        freq: [element.freq],
        alt: [element.alt],
        wind: [element.windDirection + "\xB0/" + element.windSpeed + "kt"],
        tt: [element.tt],
        wca: [element.wca],
        th: [element.th],
        var: [element.var],
        mh: [element.mh],
        tas: [element.tas],
        gs: [element.gs],
        dist: [element.distance],
        time: [element.time],
        timeAcc: [element.timeAcc],
        eto: [0],
        ff: [0],
        pwrset: [0],
    })

    this.table.push(row);
    });
    this.planSent = true;
    this.loaded = false;
  }

  get table() {
    return this.tableForm.get('table') as FormArray;
  }

  async createPDF() {  

    // let width = this.tableHTML.nativeElement.getBoundingClientRect().width;
    // let height = this.tableHTML.nativeElement.getBoundingClientRect().height

    // w,h
    let PDF = new jsPDF('p', 'pt', 'b0');

    await PDF.html(this.tableHTML.nativeElement);

    PDF.save('fligtplan.pdf');
  }
}

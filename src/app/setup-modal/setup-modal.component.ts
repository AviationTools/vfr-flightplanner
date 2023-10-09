import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {  NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { WaypointsService } from '../service/waypoints.service';

@Component({
  selector: 'app-setup-modal',
  templateUrl: './setup-modal.component.html',
  styleUrls: ['./setup-modal.component.css']
})
export class SetupModalComponent implements OnInit {

  depIcao: string;
  arrIcao: string;
  altIcao: string;
  error: string;
  
  @Output() setRunwayData = new EventEmitter();

  setupForm: FormGroup;
  @ViewChild('content') modal: ElementRef;

  constructor(
    private modalService: NgbModal,
    private fb: FormBuilder,
    private waypointsService: WaypointsService
  ) {}

  ngOnInit(): void {
    //Opens Modal
    setTimeout(() => {
      let ngbModalOptions: NgbModalOptions = {
        backdrop : 'static',
        keyboard : false
      };
      this.modalService.open(this.modal, ngbModalOptions);
    }, 1000);

    //Validation Forms
    this.setupForm = this.fb.group({
      dep: this.fb.group({
        depIcao: ['', [ Validators.required, Validators.pattern('[a-zA-Z]{4}') ]],
      }),
      arr: this.fb.group({
        arrIcao: ['', [ Validators.required, Validators.pattern('[a-zA-Z]{4}') ]],
      }),
      alt: this.fb.group({
        altIcao: ['', [ Validators.required, Validators.pattern('[a-zA-Z]{4}') ]],
      })
    })
  }

  async verifyAirports() {
    let depData;
    let arrData;
    let altData;

    this.depIcao = this.dep.value.depIcao;
    this.arrIcao = this.arr.value.arrIcao;
    this.altIcao = this.alt.value.altIcao;
    
    //Departure
    try {
      depData = await this.getRunwayLength(this.depIcao, 'true');
      depData = {
        lda: depData.lda, 
        tora: depData.tora, 
        rwy: depData.runwayEnd,
        coordinates: depData.coordinates,
        icao: depData.airportDesignator
      }
    }
    catch (e) {
      try {
        let result = await this.getAirportData(this.depIcao);
        depData = {
          lda: null, 
          tora: null, 
          rwy: 'Check AIP',
          coordinates: result.coordinates,
          icao: result.icao
        };
      }
      catch (error){
        this.errorMessage(error, this.depIcao, 'dep')
      }
    }

    //Arrival
    try {
      arrData = await this.getRunwayLength(this.arrIcao, 'false');
      arrData = {
        lda: arrData.lda, 
        tora: arrData.tora, 
        rwy: arrData.runwayEnd,
        coordinates: arrData.coordinates,
        icao: arrData.airportDesignator
      }
    }
    catch (e) {
      try {
        let result = await this.getAirportData(this.arrIcao);
        arrData = {
          lda: null, 
          tora: null, 
          rwy: 'Check AIP',
          coordinates: result.coordinates,
          icao: result.icao
        };
      }
      catch (error){
        this.errorMessage(error, this.arrIcao, 'arr')
      }
    }

    //Alternate
    try {
      altData = await this.getRunwayLength(this.altIcao, 'false');
      altData = {
        lda: altData.lda, 
        tora: altData.tora, 
        rwy: altData.runwayEnd,
        coordinates: altData.coordinates,
        icao: altData.airportDesignator
      }
      
    }
    catch (e) {
      try {
        let result = await this.getAirportData(this.altIcao);
        altData = {
          lda: null, 
          tora: null, 
          rwy: 'Check AIP',
          coordinates: result.coordinates,
          icao: result.icao
        };
      }
      catch (error){
        this.errorMessage(error, this.altIcao, 'alt')
      }
    }

    if(depData.length != 0 && arrData.length != 0 && altData.length != 0) {
      this.setRunwayData.emit({
        depIcao: depData, 
        arrIcao: arrData, 
        altIcao: altData
      });
      this.modalService.dismissAll();
    }
  }

  async getRunwayLength(icao: string, departure: string) {
    return this.waypointsService.getRunwayData(icao, departure).toPromise();
  }

  async getAirportData(icao: string) {
    return this.waypointsService.getAirportData(icao).toPromise();
  }

  errorMessage(error: any, icao: string, status: string) {
    this.error = icao + " " + error.statusText;
      if(status == "dep") {
        this.dep.setErrors({'incorrect': true});
      } else if(status == "arr") {
        this.arr.setErrors({'incorrect': true});
      } else if(status == "alt") {
        this.alt.setErrors({'incorrect': true});
      } else {
        console.log(error)
      }
  }

  get dep() {
    return this.setupForm.get('dep');
  }
  get arr() {
    return this.setupForm.get('arr');
  }
  get alt() {
    return this.setupForm.get('alt');
  }
}

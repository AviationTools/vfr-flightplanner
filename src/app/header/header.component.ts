import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbAccordion } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  headerForm: FormGroup;
  isCollapsed = false;
  iconClass = "icon-up";
  iconToggle = true;
  submit = false;
  tableReady = false;
  submitReady = false;
  tableData;

  planSent = false;
  planRecieved = false;
  loading = false;

  @ViewChild('ngbCollapse') collapse: NgbAccordion;

  @Input("depData") depData: any;
  @Input("arrData") arrData: any;
  @Input("altData") altData: any;

  @Output() removeWaypoint = new EventEmitter();
  @Output() getHeaderData = new EventEmitter();

  @ViewChild('table') tableComponent: any;
  

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    //Validation Forms
    this.headerForm = this.fb.group({
      runwaySpecs: this.fb.group({
        rwyDep: [''],
        depRwyLength: [Number],
        rwyArr: [''],
        arrRwyLength: [Number],
        rwyAlt: [''],
        altRwyLength: [Number],
      }),
      vr: this.fb.group({
        kt: ['', [ Validators.required ]],
        lhr: ['', [ Validators.required ]]
      }),
      climb: this.fb.group({
        kt: ['', [ Validators.required ]],
        lhr: ['', [ Validators.required ]]
      }),
      cruise: this.fb.group({
        kt: ['', [ Validators.required ]],
        lhr: ['', [ Validators.required ]]
      }),
      app: this.fb.group({
        kt: ['', [ Validators.required ]],
        lhr: ['', [ Validators.required ]]
      }),
      vspeeds: this.fb.group({
        vs0: ['', [ Validators.required ]],
        vx: ['', [ Validators.required ]], 
        vs1: ['', [ Validators.required ]],
        vy: ['', [ Validators.required ]],
        va: ['', [ Validators.required ]],
        vfe: ['', [ Validators.required ]],
        vs: ['', [ Validators.required ]]
      })
    });

    // this.headerForm.valueChanges.subscribe();    
    this.setDefaultValues();
  }

  setDefaultValues() {
    this.vr.setValue({kt: 55, lhr: 25});
    this.climb.setValue({kt: 70, lhr: 25});
    this.cruise.setValue({kt: 80, lhr: 20});
    this.app.setValue({kt: 70, lhr: 15});

    this.vspeeds.setValue({
      vs0: 42, 
      vx: 56,
      vs1: 48, 
      vy: 68,
      va: 97, 
      vfe: 85,
      vs: 500
    });

  }

  ngOnChanges() {
    if(this.depData) {
      this.runwaySpecs.patchValue({
        rwyDep: this.depData.rwy, 
        depRwyLength: this.depData.tora,
        rwyArr: this.arrData.rwy, 
        arrRwyLength: this.arrData.tora,
        rwyAlt: this.altData.rwy, 
        altRwyLength: this.altData.tora
      });
    }
  }

  
  depRwySet(rwy: string) {
    this.depData.forEach(element => {
      if(element.rwy == rwy) {
        this.runwaySpecs.patchValue({depRwyLength: element.tora});
      }
    });
  }
  
  arrRwySet(rwy: string) {
    this.arrData.forEach(element => {
      if(element.rwy == rwy) {
        this.runwaySpecs.patchValue({arrRwyLength: element.lda});
      }
    });
  }
  
  altRwySet(rwy: string) {
    this.altData.forEach(element => {
      if(element.rwy == rwy) {
        this.runwaySpecs.patchValue({altRwyLength: element.lda});
        
      }
    });
  }
  
  toggleCollapse() {
    if(this.iconToggle) {
      this.iconToggle = false;
      this.iconClass = "icon-down";
    }else {
      this.iconToggle = true;
      this.iconClass = "icon-up";
    }
  }
  
  removeWaypointHeaderToHome(id: number) {
    //Pass Data From Table to Home
    this.removeWaypoint.emit(id);
  }
  
  getTableObjectHeaderToHome(data) {
    //Pass Data From Table to Home
    this.tableReady = data.ready;
    if(this.tableReady && this.headerForm.valid) {
      this.tableData = data
      this.submitReady = true;
    } else{
      this.submitReady = false;
    }
  } 
  
  sendHeaderDataToHome() {
    this.loading = true;
    this.planSent = true;
    this.getHeaderData.emit({
      headerForm: this.headerForm.value,
      tableForm: this.tableData
    });
  }

  callTableComponent(data) {
    this.tableComponent.setRequestedTable(data);
    this.loading = false;
    this.planRecieved = true;
  }

  sendWaypointToTable(id, lat, lng, wypName = "") {
    this.tableComponent.addTable(id, lat, lng, wypName);
  }

  refresh(): void {
    window.location.reload();
  }
  
  get runwaySpecs() {
    return this.headerForm.get('runwaySpecs');
  }
  
  get vr() {
    return this.headerForm.get('vr');
  }
  
  get climb() {
    return this.headerForm.get('climb');
  }
  
  get cruise() {
    return this.headerForm.get('cruise');
  }

  get app() {
    return this.headerForm.get('app');
  }

  get vspeeds() {
    return this.headerForm.get('vspeeds');
  }

}


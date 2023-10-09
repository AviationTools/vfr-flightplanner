import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Waypoint } from '../models/waypoint';
import { Runway } from '../models/runway';
import { Airport } from '../models/airport';

@Injectable({
  providedIn: 'root'
})
export class WaypointsService {
  
  readonly ROOT_URL = "/data";
  
  constructor(private http: HttpClient) {
   
  }
  	
  //Server Request Methodes
  getMandatoryWaypoints() {
    let params = new HttpParams().set("mandatory" , "true").set('dataProvider', 'AT');

    return this.http.get<Waypoint[]>(this.ROOT_URL + "/reportingPoints", { params }) 
  }

  getCompulsoryWaypoints() {
    let params = new HttpParams().set("mandatory" , "false").set('dataProvider', 'AT');

    return this.http.get<Waypoint[]>(this.ROOT_URL + "/reportingPoints", { params }) 
  }

  getRunwayData(icao: string, departure: string) {
    let params = new HttpParams().set("icao", icao).set('dataProvider', 'AT').set("departure", departure);

    return this.http.get<Runway>(this.ROOT_URL + "/activeRunway", { params }) 
  }

  getAirportData(icao: string) {
    let params = new HttpParams().set("icao", icao).set('dataProvider', 'AT')

    return this.http.get<Airport>(this.ROOT_URL + "/airport", { params }) 
  }
}


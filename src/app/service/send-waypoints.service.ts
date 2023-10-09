import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SendWaypointsService {

  readonly ROOT_URL = "/data";

  constructor(private http: HttpClient) { }

  //Server Request Methodes
  sendFlightPlan(cruiseSpeed, vs, approachSpeed, body, alternate) {

    let params = new HttpParams().set("cruiseSpeed" , cruiseSpeed).set('vs', vs).set('approachSpeed', approachSpeed).set('Name', alternate.icao).set('Latitude', alternate.coordinates[1]).set('Longitude', alternate.coordinates[0]);

    return this.http.post(this.ROOT_URL + "/computeWaypoints", body, { params }) 
  }
}

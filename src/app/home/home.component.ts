import { Component, ViewChild } from '@angular/core';
import { latLng, tileLayer, marker, icon, polyline, latLngBounds, Map } from 'leaflet';
import { WaypointsService } from '../service/waypoints.service';
import { SendWaypointsService } from '../service/send-waypoints.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent {

  mapReference: Map;
  @ViewChild('header') headerComponent: any;

  options: {};
  custumWaypoints = [];
  custumPolylines = [];
  specialPolylines = [];
  specialWaypoints = [];
  mandatoryWaypoints = [];
  compulsoryWaypoints = [];
  coordinates = [];
  refernceTable = [];
  date = new Date();
  id = 0;

  //Header Data
  depData: any;
  arrData: any;
  altData: any;

  constructor(
    private waypointsService: WaypointsService,
    private sendWaypointsService: SendWaypointsService
  ) {
    this.addWaypointsToMap();
  }

  ngOnInit() {
    //Leaflet Boundries Coordinates
    let southWest = latLng(46.20000000, 9.091186523437502);
    let northEast = latLng(49.025262501613014, 17.446289062500004);
    
    //Leaflet Setup
    this.options = {
      layers: [
        tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { tileSize: 512, zoomOffset: -1 }),
        tileLayer('https://{s}.tile.maps.openaip.net/geowebcache/service/tms/1.0.0/openaip_basemap@EPSG%3A900913@png/{z}/{x}/{y}.png', { minZoom: 4, maxZoom: 14, tms: true, detectRetina: true, subdomains: '12'})
      ],
      center: latLng(47.811195, 14.033229),
      zoom: 8,
      maxBounds: latLngBounds(southWest, northEast),
      minZoom: 8
    };    
  }

  onMapReady(map: Map) {
    map.doubleClickZoom.disable();
    this.mapReference = map;
  }

  newWaypointSet(event) {
    console.log(event.latlng)
    this.id++

    let coordinate = event.latlng;
  
    //Send Waypoint to Table
    if (event.target?._popup?._content) {
      this.headerComponent.sendWaypointToTable(this.id, event.latlng.lat, event.latlng.lng, event.target._popup._content)
    } else {
      this.headerComponent.sendWaypointToTable(this.id, event.latlng.lat, event.latlng.lng)
    }

    
    this.coordinates.push([event.latlng.lat, event.latlng.lng])

    let waypoint = marker([coordinate.lat, coordinate.lng], {
        alt: this.id.toString(),
        icon: icon({
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41],
          iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
      })
    });
      
    var custumPolyline = polyline(this.coordinates, {color: 'black'});

    this.custumWaypoints.push(waypoint);
    this.custumPolylines = [];
    this.custumPolylines.push(custumPolyline);

    this.refernceTable.push({
      id: this.id,
      coord: coordinate
    })
  }

  addWaypointsToMap() {
    this.waypointsService.getMandatoryWaypoints().subscribe(result => {
      result.forEach(element => {
        let mandatoryWaypoint = marker([element.coordinates[1], element.coordinates[0]], {
            icon: icon({
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41],
            iconUrl: '../../assets/leaflet/mandatory_wyp.png'
          })
        });

        mandatoryWaypoint.bindPopup(element.name).openPopup();

        this.mandatoryWaypoints.push(mandatoryWaypoint);
      });
    });

    this.waypointsService.getCompulsoryWaypoints().subscribe(result => {
      result.forEach(element => {
        let compulsoryWaypoint = marker([element.coordinates[1], element.coordinates[0]], {
            icon: icon({
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41],
            iconUrl: '../../assets/leaflet/not_mandatory_wyp.png'
          })
        });

        compulsoryWaypoint.bindPopup(element.name).openPopup();

        this.compulsoryWaypoints.push(compulsoryWaypoint);
      });
    });
  }

  removeWaypoint(id: number) {
    let removeCoord;

    this.custumWaypoints = this.custumWaypoints.filter(el => this.convertStringtoNumber(el.options.alt) != id);

    this.refernceTable = this.refernceTable.filter(el => {
      if(el.id == id) {
        removeCoord = el.coord;
      }
      return el.id != id
    })

    this.coordinates = this.coordinates.filter(el => el[0] != removeCoord.lat && el[1] != removeCoord.lng);

    var custumPolyline = polyline(this.coordinates, {color: 'black'});
    this.custumPolylines = [];
    this.custumPolylines.push(custumPolyline);
  }

  convertStringtoNumber(id: string) {
    return parseInt(id);
  }

  setRunwayData(data) {
    setTimeout(() => {
      this.depData = data.depIcao;
      this.arrData = data.arrIcao;
      this.altData = data.altIcao;
      
      //Departure Polyline
      this.coordinates.push([data.depIcao.coordinates[1], data.depIcao.coordinates[0]])
      this.custumWaypoints.push(marker([data.depIcao.coordinates[1], data.depIcao.coordinates[0]], {
        icon: icon({
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41],
          iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        })
      }).bindPopup(this.depData.icao).openPopup());
      
      //Arrival & Alternate Polyline
      let latlongArray = [
        [data.arrIcao.coordinates[1], data.arrIcao.coordinates[0]], 
        [data.altIcao.coordinates[1], data.altIcao.coordinates[0]]
      ]
      this.specialPolylines.push(polyline(latlongArray, {color: 'blue'}));
      
      this.setMarkerOnMap(latlongArray[0][0], latlongArray[0][1], this.arrData.icao);
      this.setMarkerOnMap(latlongArray[1][0], latlongArray[1][1], this.altData.icao);
    }, 1000);
  }

  setMarkerOnMap(lat, lng, icao) {
    let specialWaypoint = marker([lat, lng], {
      icon: icon({
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
      })
    });

    specialWaypoint.bindPopup(icao).openPopup();
    this.specialWaypoints.push(specialWaypoint);
  }

  getHeaderData(data) {
    //Set Climb Speed
    data.tableForm.tableForm.forEach(element => {
      element.tas = data.headerForm.climb.kt;
    });
    
    //Add Dep Icao
    data.tableForm.tableForm.unshift({
      name: this.depData.icao,
      freq: 0,
      alt: 0,
      windDirection: 0,
      windSpeed: 0,
      latitude: this.depData.coordinates[1],
      longitude: this.depData.coordinates[0],
      tas: data.headerForm.climb.kt
    })

    //Add Arr Icao
    data.tableForm.tableForm.push({
      name: this.arrData.icao,
      freq: 0,
      alt: 0,
      windDirection: 0,
      windSpeed: 0,
      latitude: this.arrData.coordinates[1],
      longitude: this.arrData.coordinates[0],
      tas: data.headerForm.climb.kt
    })

    //Send Waypoints
    this.sendWaypointsService.sendFlightPlan(data.headerForm.cruise.kt, data.headerForm.vspeeds.vs, data.headerForm.app.kt, data.tableForm.tableForm, this.altData).subscribe(result => {
      // console.log(result);
      this.updateMapAfterRequest(result);
      this.headerComponent.callTableComponent(result);
    });
  }

  updateMapAfterRequest(result) {
    let lastWaypoint = result[result.length-2]

    this.coordinates.push([lastWaypoint.coords.latitude, lastWaypoint.coords.longitude])

    let waypoint = marker([lastWaypoint.coords.latitude, lastWaypoint.coords.longitude], {
        alt: this.id.toString(),
        icon: icon({
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41],
          iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
      })
    });
      
    var custumPolyline = polyline(this.coordinates, {color: 'black'});

    this.custumWaypoints.push(waypoint);
    this.custumPolylines = [];
    this.custumPolylines.push(custumPolyline);
  }
}



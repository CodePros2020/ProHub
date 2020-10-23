import {AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {icon, latLng, LeafletMouseEvent, Map, MapOptions, marker, tileLayer} from 'leaflet';
import {MapPoint} from '../../../../shared-models/map-point.model';
import {NominatimResponse} from '../../../../shared-models/nominatim-response.model';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {PropertyModel} from '../manager/property.model';
import {debounceTime, filter, map, startWith, switchMap} from 'rxjs/operators';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {MapsNominatimService} from '../../../../shared-services/maps-nominatim.service';

@Component({
  selector: 'app-create-update-property',
  templateUrl: './create-update-property.component.html',
  styleUrls: ['./create-update-property.component.scss']
})
export class CreateUpdatePropertyComponent implements OnInit, AfterViewInit {

  isEditMode;

  public createPropertyForm: FormGroup;
  public propertyModel: PropertyModel;
  public searchAddressResult: Observable<NominatimResponse[]>;
  public addressResult;

  // test
  optionsAddy = new BehaviorSubject<NominatimResponse[]>([]);
  searchAddyResult = [];
  isAddressSearchApiRunning = false;

  DEFAULT_LATITUDE = 43.662762;
  DEFAULT_LONGITUDE = -79.397308;

  map: Map;
  mapPoint: MapPoint;
  options: MapOptions;
  lastLayer: any;

  searchResults: NominatimResponse[];
  address = '';

  constructor(private formBuilder: FormBuilder,
              private nominatimService: MapsNominatimService) {
    this.isEditMode = false;
    this.propertyModel = new PropertyModel();
    this.createPropertyFormGroup();
  }

  ngOnInit(): void {
    this.initializeDefaultMapPoint();
    this.initializeMapOptions();
    this.onAddyValueChange();
    this.filteredOptions();
  }

  ngAfterViewInit() {
  }

  // for autocomplete and api search test
  onAddyValueChange() {
    this.searchAddyResult = [];

    this.formControls.propertyAddress.valueChanges.pipe(
      filter(data => (data !== null) ? data.trim().length > 0 : data),
      debounceTime(50),
      switchMap((name: string) => {
        console.log('trim', name);
        this.isAddressSearchApiRunning = true;
        return name ? this.addySearch(name) : of([]);
      })
    ).subscribe(data => {
      this.searchAddyResult = data;
      console.log('search addy result: ', this.searchAddyResult);
    });
  }

  addySearch(value) {
    // this.searchAddyResult = [];
    this.nominatimService.addressLookup(value).subscribe(res => {
      console.log('this is res', res);
      this.searchResults = res;
      console.log('search addy result2', this.searchResults);
      if (res && this.searchResults.length > 0) {
        this.isAddressSearchApiRunning = false;
      }
      this.optionsAddy.next(res);
    });
    return of(this.optionsAddy.value);
  }

  createPropertyFormGroup() {
    this.createPropertyForm = this.formBuilder.group({
      propertyName: [this.propertyModel.propertyName, Validators.required],
      numUnits: [this.propertyModel.numUnits, Validators.required],
      propertyAddress: [this.propertyModel.propertyAddress, Validators.required]
    });
  }

  get formControls() {
    return this.createPropertyForm.controls;
  }

  addressLookup(event: any) {
    this.address = event.target.value;
    console.log('what is address', this.address);
    if (this.address.length > 3) {
      this.nominatimService.addressLookup(this.address).subscribe(results => {
        console.log('checking api results: ', results);
        this.searchResults = results;
        console.log('search results: ', this.searchResults);
      });
    } else {
      this.searchResults = [];
    }
  }

  filteredOptions() {
    this.searchAddressResult = this.formControls.propertyAddress.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );
  }

  private _filter(value): NominatimResponse[] {
    const filterValue = value.toLowerCase();

    return this.addressResult.filter(option => option.name.toLowerCase().indexOf(filterValue) === 0);
  }

  initializeMap(mapOSM: Map) {
    this.map = mapOSM;
    this.createMarker();
  }

  getAddress(result: NominatimResponse) {
    this.updateMapPoint(result.latitude, result.longitude, result.displayName, result.osm);
    this.createMarker();
  }

  refreshSearchList(results: NominatimResponse[]) {
    this.searchResults = results;
  }

  initializeMapOptions() {
    this.options = {
      zoom: 15,
      layers: [
        tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {maxZoom: 18, attribution: 'OSM'})
      ]
    };
  }

  initializeDefaultMapPoint() {
    this.mapPoint = {
      name: 'Hello',
      latitude: this.DEFAULT_LATITUDE,
      longitude: this.DEFAULT_LONGITUDE,
      osm: 1
    };
  }

  onMapClick(e: LeafletMouseEvent) {
    this.clearMap();
    this.updateMapPoint(e.latlng.lat, e.latlng.lng);
    this.createMarker();
  }

  updateMapPoint(lat: number, long: number, name?: string, osmNum?: number) {
    this.mapPoint = {
      latitude: lat,
      longitude: long,
      name: name ? name : this.mapPoint.name,
      osm: osmNum
    };

    console.log('checking what are coords: ' + lat + '---' + long);
  }

  createMarker() {
    this.clearMap();
    const mapIcon = this.getDefaultIcon();
    const coordinates = latLng([this.mapPoint.latitude, this.mapPoint.longitude]);
    this.lastLayer = marker(coordinates).setIcon(mapIcon).addTo(this.map);
    this.map.setView(coordinates, this.map.getZoom());
  }

  getDefaultIcon() {
    return icon({
      iconSize: [25, 41],
      iconAnchor: [13, 41],
      iconUrl: 'assets/marker-icon.png'
    });
  }

  clearMap() {
    if (this.map.hasLayer(this.lastLayer)) { this.map.removeLayer(this.lastLayer); }
  }
}

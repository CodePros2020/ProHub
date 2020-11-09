import {AfterViewInit, Component, ElementRef, Inject, Input, OnInit, ViewChild} from '@angular/core';
import {icon, latLng, LeafletMouseEvent, Map, MapOptions, marker, tileLayer} from 'leaflet';
import {MapPoint} from '../../../../shared-models/map-point.model';
import {NominatimResponse} from '../../../../shared-models/nominatim-response.model';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {PropertyModel} from '../manager/property.model';
import {debounceTime, filter, map, startWith, switchMap} from 'rxjs/operators';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {MapsNominatimService} from '../../../../shared-services/maps-nominatim.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {ProvinceEnum} from '../../../../shared-models/enum/province.enum';
import {PropertyService} from '../../../../shared-services/property.service';
import {AuthService} from '../../../../shared-services/auth.service';

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
  public provinces;

  // test
  optionsAddy = new BehaviorSubject<NominatimResponse[]>([]);
  searchAddyResult = [];
  isAddressSearchApiRunning = false;

  // DEFAULT_LATITUDE = 43.662762;
  // DEFAULT_LONGITUDE = -79.397308;
  lat: any;
  long: any;

  map: Map;
  mapPoint: MapPoint;
  options: MapOptions;
  lastLayer: any;

  searchResults: NominatimResponse[];
  address = '';

  constructor(private formBuilder: FormBuilder,
              private propertyService: PropertyService,
              private authService: AuthService,
              private nominatimService: MapsNominatimService,
              private dialogRef: MatDialogRef<CreateUpdatePropertyComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {

    this.propertyModel = new PropertyModel();

    if (this.data.update === false) {
      this.isEditMode = false;
      this.lat = 43.662762;
      this.long = -79.397308;
    } else {
      this.isEditMode = true;
      this.propertyModel = this.data.property;
      console.log('property model lat', this.propertyModel.lat);
      if (this.propertyModel.lat === undefined || this.propertyModel.lat === null) {
        this.lat = 43.662762;
      } else {
        this.lat = this.propertyModel.lat;
      }

      console.log('property model long', this.propertyModel.long);
      if (this.propertyModel.long === undefined || this.propertyModel.long === null) {
        this.long = -79.397308;
      } else {
        this.long = this.propertyModel.long;
      }
    }

    this.createPropertyFormGroup();
  }

  ngOnInit(): void {
    this.initializeDefaultMapPoint();
    this.initializeMapOptions();
    // this.onAddyValueChange();
    // this.filteredOptions();
    this.provinces = ProvinceEnum;
  }

  ngAfterViewInit() {
  }

  // this will ensure that the enum are not sorted alphabetically
  returnZero() {
    return 0;
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
      propertyName: [this.propertyModel.name, Validators.required],
      streetLine1: [this.propertyModel.streetLine1, Validators.required],
      streetLine2: [this.propertyModel.streetLine2],
      city: [this.propertyModel.city, Validators.required],
      province: [this.propertyModel.province, Validators.required],
      postalCode: [this.propertyModel.postalCode, Validators.required],
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

  structuredAddressLookUp() {
    const street = this.formControls.streetLine1.value || '';
    const city = this.formControls.city.value || '';
    const province = this.formControls.province.value || '';

    console.log('Street: ' + street + ' City: ' + city + ' Province: ' + province);

    if (street === '' && city === '' && province === '') {
      console.log('Dont do anything!');
    } else {
      this.nominatimService.addressLookup(street, city, province).subscribe(results => {
        console.log('checking api results: ', results);
        this.searchResults = results;
        console.log('search results: ', this.searchResults);
        console.log('what is results length', results.length);

        if (this.searchResults.length > 0) {
          console.log('length is more than 1');
          this.getAddress(this.searchResults[0]);
        }
      });
    }
  }

  initializeMap(mapOSM: Map) {
    this.map = mapOSM;
    this.createMarker();
  }

  getAddress(result: NominatimResponse) {
    console.log('coming to get Address');
    this.updateMapPoint(result.latitude, result.longitude, result.displayName, result.osm);
    this.createMarker();
    this.lat = result.latitude;
    this.long = result.longitude;
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
      latitude: this.lat,
      longitude: this.long,
      osm: 1
    };

    console.log('map point edit mode', this.isEditMode);
    console.log('lat', this.lat);
    console.log('long', this.long);
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

  onCancelClick() {
    this.dialogRef.close(false);
  }

  saveProperty() {
    if (this.createPropertyForm.valid) {

      this.propertyModel.name = this.formControls.propertyName.value;
      this.propertyModel.streetLine1 = this.formControls.streetLine1.value;
      this.propertyModel.streetLine2 = this.formControls.streetLine2.value || '';
      this.propertyModel.city = this.formControls.city.value;
      this.propertyModel.province = this.formControls.province.value;
      this.propertyModel.postalCode = this.formControls.postalCode.value;
      this.propertyModel.long = this.long;
      this.propertyModel.lat = this.lat;

      if (this.isEditMode) {
        console.log('in update save');
        this.propertyService.update(this.propertyModel.key, this.propertyModel)
          .then(() => this.dialogRef.close('updated'));
      } else {
        this.propertyModel.phone = this.authService.GetUserInSession().phoneNumber;
        this.propertyModel.propId = '';
        this.propertyModel.creatorEmail = this.authService.userData.email;
        this.propertyService.create(this.propertyModel);
        this.dialogRef.close('added');
      }
    }
  }
}

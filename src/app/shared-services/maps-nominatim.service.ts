import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {NominatimResponse} from '../shared-models/nominatim-response.model';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MapsNominatimService {

  BASE_NOMINATIM_URL = 'nominatim.openstreetmap.org';
  DEFAULT_VIEW_BOX = 'viewbox=-79.21767%2C43.76187%2C-79.21228%2C43.76096'; // Ontario

  constructor(private http: HttpClient) { }

  // this url is with view box that only searches within Ontario
  // addressLookup(req?: any): Observable<NominatimResponse[]> {
  //   const url = `https://${this.BASE_NOMINATIM_URL}/search?format=json&q=${req}&${this.DEFAULT_VIEW_BOX}&bounded=1`;
  //   console.log('check what url looks like: ', url);
  //   return this.http
  //     .get(url).pipe(
  //       map((data: any[]) => data.map((item: any) => new NominatimResponse(
  //         item.lat,
  //         item.lon,
  //         item.display_name,
  //         item.osm
  //         ))
  //       )
  //     );
  // }

  // this url searches all addresses in the world
  // addressLookup(req?: any): Observable<NominatimResponse[]> {
  //   const url = `https://${this.BASE_NOMINATIM_URL}/search.php?q=${req}&$polygon_geojson=1&format=jsonv2`;
  //   console.log('check what url looks like: ', url);
  //   return this.http
  //     .get(url).pipe(
  //       map((data: any[]) => data.map((item: any) => new NominatimResponse(
  //         item.lat,
  //         item.lon,
  //         item.display_name,
  //         item.osm_id
  //         ))
  //       )
  //     );
  // }

  // this url has a structured search
  addressLookup(street?: any, city?: any, province?: any): Observable<NominatimResponse[]> {
    const url = `https://${this.BASE_NOMINATIM_URL}/search.php?street=${street}&city=${city}&state=${province}&country=Canada&polygon_geojson=1&format=jsonv2`;
    // console.log('check what url looks like: ', url);
    return this.http
      .get(url).pipe(
        map((data: any[]) => data.map((item: any) => new NominatimResponse(
          item.lat,
          item.lon,
          item.display_name,
          item.osm_id
          ))
        )
      );
  }

}

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

  addressLookup(req?: any): Observable<NominatimResponse[]> {
    const url = `https://${this.BASE_NOMINATIM_URL}/search?format=json&q=${req}&${this.DEFAULT_VIEW_BOX}&bounded=1`;
    console.log('check what url looks like: ', url);
    return this.http
      .get(url).pipe(
        map((data: any[]) => data.map((item: any) => new NominatimResponse(
          item.lat,
          item.lon,
          item.display_name,
          item.osm
          ))
        )
      );
  }
}

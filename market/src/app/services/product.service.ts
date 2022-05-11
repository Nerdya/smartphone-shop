import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(public httpClient: HttpClient) { }

  getDeals(): Observable<any> {
    return this.httpClient.get(environment.API_URL + 'deals');
  }

  getPhones(): Observable<any> {
    return this.httpClient.get(environment.API_URL + 'phones');
  }
}

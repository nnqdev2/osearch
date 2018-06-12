import { Injectable } from '@angular/core';
import { Router, Resolve, RouterStateSnapshot,
         ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { StreetType } from '../models/street-type';
import { LustDataService } from '../services/lust-data.service';

@Injectable({
  providedIn: 'root'
})
export class StreetTypesResolver implements Resolve<Observable<StreetType[]>> {
  constructor(private lustDataService: LustDataService, private router: Router) {}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<StreetType[]> {
    return this.lustDataService.getStreetTypes();
  }
}

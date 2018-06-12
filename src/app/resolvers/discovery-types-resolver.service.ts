import { Injectable } from '@angular/core';
import { Router, Resolve, RouterStateSnapshot,
         ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { DiscoveryType } from '../models/discovery-type';
import { LustDataService } from '../services/lust-data.service';

@Injectable({
  providedIn: 'root'
})
export class DiscoveryTypesResolver implements Resolve<Observable<DiscoveryType[]>> {
  constructor(private lustDataService: LustDataService, private router: Router) {}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<DiscoveryType[]> {
    return this.lustDataService.getDiscoveryTypes();
  }
}

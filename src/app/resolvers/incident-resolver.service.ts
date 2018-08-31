import { Injectable } from '@angular/core';
import { Router, Resolve, RouterStateSnapshot,
         ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { ConfirmationType } from '../models/confirmation-type';
import { LustDataService } from '../services/lust-data.service';
import { IncidentData } from '../models/incident-data';
import { map, mergeMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class IncidentDataResolver implements Resolve<Observable<IncidentData>> {
  constructor(private lustDataService: LustDataService, private router: Router) {}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IncidentData> {
    return this.lustDataService.getIncidentData(route.paramMap.get('olprrid'));
  }
}


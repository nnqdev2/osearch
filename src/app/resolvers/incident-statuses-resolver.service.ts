import { Injectable } from '@angular/core';
import { Router, Resolve, RouterStateSnapshot,
         ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { LustDataService } from '../services/lust-data.service';
import { IncidentStatus } from '../models/incident-status';

@Injectable({
  providedIn: 'root'
})
export class IncidentStatusesResolver implements Resolve<Observable<IncidentStatus[]>> {
  constructor(private lustDataService: LustDataService, private router: Router) {}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IncidentStatus[]> {
    return this.lustDataService.getIncidentStatuses();
  }
}

import { Injectable } from '@angular/core';
import { Router, Resolve, RouterStateSnapshot,
         ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { LustDataService } from '../services/lust-data.service';
import { LustIncidentGet } from '../models/lust-incident-get';

@Injectable({
  providedIn: 'root'
})
export class LustIncidentGetResolver implements Resolve<Observable<LustIncidentGet>> {
  constructor(private lustDataService: LustDataService, private router: Router) {}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<LustIncidentGet> {
    return this.lustDataService.getLustIncident(route.parent.paramMap.get('lustid'));
    // return this.lustDataService.getLustIncident(route.paramMap.get('lustid'));
  }
}

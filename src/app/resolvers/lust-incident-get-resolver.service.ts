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
    console.log('**********LustIncidentGetResolver** 11111  *********************');
    console.log(route.parent.paramMap);
    console.log('**********LustIncidentGetResolver*** 22222 ********************');
    console.log(route.parent.paramMap.get('lustid'));
    const lustId = route.parent.paramMap.get('lustid');
    // return this.lustDataService.getLustIncident(route.parent.paramMap.get('lustid'));
    return this.lustDataService.getLustIncident(lustId);
  }
}

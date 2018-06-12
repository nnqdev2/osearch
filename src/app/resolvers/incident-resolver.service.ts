import { Injectable } from '@angular/core';
import { Router, Resolve, RouterStateSnapshot,
         ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { ConfirmationType } from '../models/confirmation-type';
import { LustDataService } from '../services/lust-data.service';
import { IncidentData } from '../models/incident-review';

@Injectable({
  providedIn: 'root'
})
export class IncidentReviewResolver implements Resolve<Observable<IncidentData>> {
  constructor(private lustDataService: LustDataService, private router: Router) {}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IncidentData> {
      const myid = route.paramMap.get('olprrid');
    console.log('************IncidentReviewResolver' );
    console.log(myid);
    return this.lustDataService.getIncidentData(route.paramMap.get('olprrid'));
  }
}

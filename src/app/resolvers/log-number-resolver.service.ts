import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { ApGetLogNumber } from '../models/apGetLogNumber';
import { LustDataService } from '../services/lust-data.service';

@Injectable({
  providedIn: 'root'
})
export class LogNumberResolver implements Resolve<Observable<ApGetLogNumber>> {
  constructor(private lustDataService: LustDataService, private router: Router) {}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ApGetLogNumber> {
    let lustId = +route.parent.params['lustid'];
    if (isNaN(lustId)) {
      lustId = +route.pathFromRoot[2].params['lustid'];
    }
    return this.lustDataService.getLogNumber(lustId);
  }
}

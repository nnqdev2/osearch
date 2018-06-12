import { Injectable } from '@angular/core';
import { Router, Resolve, RouterStateSnapshot,
         ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { ReleaseCauseType } from '../models/release-cause-type';
import { LustDataService } from '../services/lust-data.service';

@Injectable({
  providedIn: 'root'
})
export class ReleaseCauseTypesResolver implements Resolve<Observable<ReleaseCauseType[]>> {
  constructor(private lustDataService: LustDataService, private router: Router) {}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ReleaseCauseType[]> {
    return this.lustDataService.getReleaseCauseTypes();
  }
}

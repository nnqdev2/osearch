import { Injectable } from '@angular/core';
import { Router, Resolve, RouterStateSnapshot,
         ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { LustDataService } from '../services/lust-data.service';
import { SiteType2 } from '../models/site-type2';

@Injectable({
  providedIn: 'root'
})
export class SiteType2sResolver implements Resolve<Observable<SiteType2[]>> {
  constructor(private lustDataService: LustDataService, private router: Router) {}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<SiteType2[]> {
    return this.lustDataService.getSiteType2s();
  }
}

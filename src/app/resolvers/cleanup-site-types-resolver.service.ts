import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { LustDataService } from '../services/lust-data.service';
import { Observable } from 'rxjs';
import { CleanupSiteType } from '../models/cleanup-site-type';

@Injectable({
  providedIn: 'root'
})
export class CleanupSiteTypesResolver implements Resolve<Observable<CleanupSiteType[]>> {
  constructor(private lustDataService: LustDataService, private router: Router) {}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<CleanupSiteType[]> {
    return this.lustDataService.getCleanupSiteTypes();
  }
}